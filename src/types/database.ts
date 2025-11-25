// Database types matching Supabase schema
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: CategoryInsert
        Update: CategoryUpdate
      }
      subcategories: {
        Row: Subcategory
        Insert: SubcategoryInsert
        Update: SubcategoryUpdate
      }
      skills: {
        Row: Skill
        Insert: SkillInsert
        Update: SkillUpdate
      }
      experiences: {
        Row: Experience
        Insert: ExperienceInsert
        Update: ExperienceUpdate
      }
      education: {
        Row: Education
        Insert: EducationInsert
        Update: EducationUpdate
      }
      certifications: {
        Row: Certification
        Insert: CertificationInsert
        Update: CertificationUpdate
      }
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
    }
  }
}

// Categories
export interface Category {
  id: string
  name: string
  sort_order: number
  created_at: string
}

export interface CategoryInsert {
  id?: string
  name: string
  sort_order?: number
  created_at?: string
}

export interface CategoryUpdate {
  name?: string
  sort_order?: number
}

// Subcategories
export interface Subcategory {
  id: string
  category_id: string
  name: string
  sort_order: number
  created_at: string
}

export interface SubcategoryInsert {
  id?: string
  category_id: string
  name: string
  sort_order?: number
  created_at?: string
}

export interface SubcategoryUpdate {
  category_id?: string
  name?: string
  sort_order?: number
}

// Skills
export interface Skill {
  id: string
  subcategory_id: string
  name: string
  level: string | null
  years: number | null
  description: string | null
  links: Record<string, unknown> | null
  sort_order: number
  created_at: string
}

export interface SkillInsert {
  id?: string
  subcategory_id: string
  name: string
  level?: string | null
  years?: number | null
  description?: string | null
  links?: Record<string, unknown> | null
  sort_order?: number
  created_at?: string
}

export interface SkillUpdate {
  subcategory_id?: string
  name?: string
  level?: string | null
  years?: number | null
  description?: string | null
  links?: Record<string, unknown> | null
  sort_order?: number
}

// Experiences
export interface Experience {
  id: string
  company: string
  role: string
  start_date: string
  end_date: string | null
  bullets: Record<string, unknown> | null
  created_at: string
}

export interface ExperienceInsert {
  id?: string
  company: string
  role: string
  start_date: string
  end_date?: string | null
  bullets?: Record<string, unknown> | null
  created_at?: string
}

export interface ExperienceUpdate {
  company?: string
  role?: string
  start_date?: string
  end_date?: string | null
  bullets?: Record<string, unknown> | null
}

// Education
export interface Education {
  id: string
  school: string
  degree: string
  start_date: string
  end_date: string | null
  details: Record<string, unknown> | null
  created_at: string
}

export interface EducationInsert {
  id?: string
  school: string
  degree: string
  start_date: string
  end_date?: string | null
  details?: Record<string, unknown> | null
  created_at?: string
}

export interface EducationUpdate {
  school?: string
  degree?: string
  start_date?: string
  end_date?: string | null
  details?: Record<string, unknown> | null
}

// Certifications
export interface Certification {
  id: string
  name: string
  issuing_organization: string
  issued_at: string
  credential_id: string | null
  credential_url: string | null
  sort_order: number
  created_at: string
}

export interface CertificationInsert {
  id?: string
  name: string
  issuing_organization: string
  issued_at: string
  credential_id?: string | null
  credential_url?: string | null
  sort_order?: number
  created_at?: string
}

export interface CertificationUpdate {
  name?: string
  issuing_organization?: string
  issued_at?: string
  credential_id?: string | null
  credential_url?: string | null
  sort_order?: number
}

// Profiles (for auth)
export interface Profile {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  email: string
  full_name?: string | null
  is_admin?: boolean
  created_at?: string
  updated_at?: string
}

export interface ProfileUpdate {
  email?: string
  full_name?: string | null
  is_admin?: boolean
  updated_at?: string
}
