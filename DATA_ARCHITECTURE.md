# Data Architecture: Skills vs Certifications

## Overview
This document explains the refactoring from storing certifications in the `skills` table to a dedicated `certifications` table, and why this is a better approach.

---

## Before: Certifications in Skills Table

### Structure (Old Approach)
```
categories
├── Name: "Technical Skills" (or similar)
└── subcategories
    ├── "Languages & Frameworks"
    │   └── skills (multiple entries)
    └── "Certifications"  ← Certifications were here
        ├── AWS Certified Cloud Practitioner
        ├── AWS Certified Solutions Architect – Associate
        └── Professional Scrum Master I (PSM I)
```

### Data Model (Old)
```sql
-- Skills table storing everything including certs
CREATE TABLE skills (
  id UUID,
  subcategory_id UUID,        -- References "Certifications" subcategory
  name TEXT,                  -- "AWS Cloud Practitioner"
  level TEXT,                 -- "certified"
  years NUMERIC,              -- Years of experience (not relevant for certs)
  description TEXT,           -- Description/details
  links JSONB,                -- Custom links
  sort_order INT
);
```

### Problems with Old Approach
❌ **Semantic Mismatch** - Certifications aren't skills; they're credentials
❌ **Wasted Fields** - `years` field makes no sense for certifications
❌ **Query Complexity** - Required joining through categories → subcategories → skills
❌ **Type Confusion** - Can't distinguish certs from actual skills without category checking
❌ **Missing Metadata** - No natural place for:
  - Issuing organization
  - Credential ID/number
  - Expiration date
  - Verification URL
❌ **Hard to Filter** - Had to check subcategory.name == "Certifications" to find them
❌ **Performance** - Fetched all skills just to filter certifications

---

## After: Dedicated Certifications Table

### Structure (New Approach)
```
skills (technical skills only)
├── Programming Languages & Frameworks
├── Databases & Tools
└── Other technical skills

certifications (professional credentials)
├── AWS Certified Cloud Practitioner
├── AWS Certified Solutions Architect – Associate
└── Professional Scrum Master I (PSM I)
```

### Data Model (New)
```sql
-- Certifications table with cert-specific fields
CREATE TABLE certifications (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,                    -- "AWS Cloud Practitioner"
  issuing_organization TEXT NOT NULL,    -- "Amazon Web Services"
  issued_at DATE NOT NULL,               -- "2022-04-15"
  credential_id TEXT,                    -- "AKIAJ7EXAMPLE" (optional)
  credential_url TEXT,                   -- "https://aws.amazon.com/verify..." (optional)
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Benefits of New Approach
✅ **Semantic Clarity** - Certifications are clearly certifications, not skills
✅ **Relevant Fields Only** - Every column has meaning for credentials
✅ **Direct Queries** - Simple `SELECT * FROM certifications` instead of complex joins
✅ **Type Safety** - Certification interface is distinct from Skill interface
✅ **Future-Ready Metadata** - Can easily add:
  - `expires_at` for time-sensitive certs
  - `renewal_date` for recurring certs
  - `badge_url` for org-branded badges
✅ **Easy Filtering** - No need to check category names
✅ **Better Performance** - Separate table, dedicated queries
✅ **Scaling** - As resume grows, certs don't clutter skill queries

---

## Data Migration Summary

### What Moved
3 certifications moved from `skills` table to new `certifications` table:

| Old Location | New Location | Data Change |
|---|---|---|
| skills table, "Certifications" subcategory | certifications table | name stays same |
| level: "certified" | (removed) | not needed |
| years: null or 0 | (removed) | not relevant |
| created_at | created_at | preserved |
| sort_order | sort_order | preserved |
| (none) | issuing_organization | added |
| (none) | issued_at | added (dates provided) |

### Certification Data Inserted
```sql
INSERT INTO public.certifications
(name, issuing_organization, issued_at, sort_order)
VALUES
('AWS Certified Cloud Practitioner Foundational', 'Amazon Web Services', '2022-04-01'::DATE, 1),
('AWS Certified Solutions Architect – Associate', 'Amazon Web Services', '2023-07-01'::DATE, 2),
('Professional Scrum Master I (PSM I)', 'Scrum Alliance', '2024-11-01'::DATE, 3);
```

---

## Code Changes

### Frontend Data Fetching

#### Before (Old Approach)
```typescript
// Had to fetch all skills and filter for certifications
const skills = await supabase
  .from('skills')
  .select(`*, subcategory(name, category(name))`)
  .order('sort_order');

// Then filter in JavaScript
const certs = skills.filter(s =>
  s.subcategory?.name === 'Certifications'
);
```

#### After (New Approach)
```typescript
// Direct, simple query for certifications
const certifications = await supabase
  .from('certifications')
  .select('*')
  .order('sort_order');
```

### React Components

#### Before (Mixed Skills & Certs)
- Single `SkillsSection` component displayed both skills and certifications
- Had to check item type to render differently
- Timeline logic mixed for both types

#### After (Separated)
- `SkillsSection` - only technical skills
- `CertificationsSection` - only certifications
- Each component optimized for its data type
- Clear visual separation on page
- Easier to maintain and customize

### TypeScript Types

#### Before
```typescript
interface Skill {
  id: string;
  name: string;
  level: string | null;      // "certified" for certs
  years: number | null;       // null or 0 for certs
  description: string | null;
  subcategory: {
    name: string;            // Must check === "Certifications"
  };
}
```

#### After
```typescript
// Skills
interface Skill {
  id: string;
  name: string;
  level: string | null;      // "expert", "advanced", etc.
  years: number | null;       // actual experience years
  description: string | null;
  subcategory: { name: string };
}

// Certifications
interface Certification {
  id: string;
  name: string;                        // Cert name
  issuing_organization: string;        // AWS, Scrum Alliance, etc.
  issued_at: string;                   // Date earned
  credential_id: string | null;        // For verification
  credential_url: string | null;       // Link to verify
  sort_order: number;
  created_at: string;
}
```

---

## Navigation & Page Structure

### Before
```
/resume
├── HeaderSection
├── StickyResumeNav (Skills | Experience | Education)
└── Skills Section (contains both skills AND certifications)
├── Experience Section
└── Education Section
```

### After
```
/resume
├── HeaderSection
├── StickyResumeNav (Skills | Certifications | Experience | Education)  ← Updated
├── Skills Section (only technical skills)
├── Certifications Section ← New dedicated section
├── Experience Section
└── Education Section
```

---

## Database Relationships

### Before
```
categories
    ↓ (many-to-one)
subcategories (includes "Certifications" subcategory)
    ↓ (many-to-one)
skills (includes cert items with level="certified")
```

### After
```
skills → subcategories → categories  (only for actual skills)

certifications (standalone, independent table)
```

**Benefit:** Certifications are no longer dependent on the category/subcategory hierarchy.

---

## RLS (Row Level Security)

### Before
Certs had same RLS as skills:
```sql
-- Public can read any skill (including certs)
CREATE POLICY "Public read" ON skills FOR SELECT USING (true);

-- Admin can manage any skill (including certs)
CREATE POLICY "Admin write" ON skills
  FOR INSERT/UPDATE/DELETE USING (is_admin());
```

### After
Certs have their own dedicated policies:
```sql
-- Public can read any certification
CREATE POLICY "Public read" ON certifications FOR SELECT USING (true);

-- Admin can manage certifications
CREATE POLICY "Admin insert" ON certifications
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update" ON certifications
  FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete" ON certifications
  FOR DELETE USING (is_admin());
```

**Benefit:** Future granular control (e.g., special "certifications_manager" role if needed).

---

## Performance Comparison

### Query Performance

| Operation | Before | After |
|---|---|---|
| Fetch all skills | Fast (direct table) | Fast (direct table) |
| Fetch certifications only | Slow (filter after fetch) | Fast (direct query) |
| Fetch skills + certs separate | Requires 2 queries | Requires 2 queries |
| Fetch skills without certs | Must filter in app | Single query, no filter |
| Add new cert | Insert into skills (with category FK) | Insert into certifications (direct) |

### Database Size
- Certifications no longer taking space in skills table
- Can add cert-specific indexes later if needed
- Cleaner schema, easier to understand

---

## Future Extensibility

### Easy Additions to Certifications
```sql
-- Add expiration tracking
ALTER TABLE certifications ADD COLUMN expires_at DATE;

-- Add renewal info
ALTER TABLE certifications ADD COLUMN renewal_date DATE;

-- Add badge/image
ALTER TABLE certifications ADD COLUMN badge_url TEXT;

-- Add cost (for tracking education investment)
ALTER TABLE certifications ADD COLUMN cost_usd NUMERIC;
```

### Would Be Awkward in Skills Table
- These fields don't make sense for skills
- Would require schema migration affecting both skills and certs
- Would add columns that are unused for most rows

---

## Summary

| Aspect | Before (Mixed) | After (Separated) |
|---|---|---|
| **Data Model** | Certs in skills table | Dedicated certifications table |
| **Queries** | Complex joins, filter in code | Simple direct SELECT |
| **Type Safety** | Mixed Skill type | Distinct Certification type |
| **Metadata** | Limited (level, years, description) | Rich (organization, issued_at, credential_url) |
| **Performance** | Good but with filtering overhead | Better with direct queries |
| **Maintainability** | Harder to distinguish cert logic | Clearer separation of concerns |
| **UI Components** | Mixed SkillsSection | Separate CertificationsSection |
| **Future Growth** | Would get complicated | Easy to extend with new fields |

---

## Conclusion

The new dedicated `certifications` table provides:
- ✅ Better semantic representation
- ✅ Cleaner code and data model
- ✅ Improved performance (no filtering needed)
- ✅ Easier to maintain and scale
- ✅ Better type safety
- ✅ Foundation for future enhancements

This is a **best practice** approach and sets up your resume app for long-term maintainability.
