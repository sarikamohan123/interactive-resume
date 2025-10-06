import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Folder, Network, Code, Briefcase, GraduationCap } from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

interface EntityStats {
  count: number
  lastUpdated: string | null
  mostRecent: string | null
}

function AdminDashboard() {
  // Fetch counts and metadata for all entities
  const { data: categoriesStats, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-stats'],
    queryFn: async (): Promise<EntityStats> => {
      const { count } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

      const { data: recent } = await supabase
        .from('categories')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        count: count ?? 0,
        lastUpdated: recent?.created_at ?? null,
        mostRecent: recent?.name ?? null,
      }
    },
  })

  const { data: subcategoriesStats, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['subcategories-stats'],
    queryFn: async (): Promise<EntityStats> => {
      const { count } = await supabase
        .from('subcategories')
        .select('*', { count: 'exact', head: true })

      const { data: recent } = await supabase
        .from('subcategories')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        count: count ?? 0,
        lastUpdated: recent?.created_at ?? null,
        mostRecent: recent?.name ?? null,
      }
    },
  })

  const { data: skillsStats, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills-stats'],
    queryFn: async (): Promise<EntityStats> => {
      const { count } = await supabase
        .from('skills')
        .select('*', { count: 'exact', head: true })

      const { data: recent } = await supabase
        .from('skills')
        .select('name, level, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        count: count ?? 0,
        lastUpdated: recent?.created_at ?? null,
        mostRecent: recent ? `${recent.name}${recent.level ? ` (${recent.level})` : ''}` : null,
      }
    },
  })

  const { data: experiencesStats, isLoading: experiencesLoading } = useQuery({
    queryKey: ['experiences-stats'],
    queryFn: async (): Promise<EntityStats> => {
      const { count } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })

      const { data: recent } = await supabase
        .from('experiences')
        .select('company, role, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        count: count ?? 0,
        lastUpdated: recent?.created_at ?? null,
        mostRecent: recent ? `${recent.company} - ${recent.role}` : null,
      }
    },
  })

  const { data: educationStats, isLoading: educationLoading } = useQuery({
    queryKey: ['education-stats'],
    queryFn: async (): Promise<EntityStats> => {
      const { count } = await supabase
        .from('education')
        .select('*', { count: 'exact', head: true })

      const { data: recent } = await supabase
        .from('education')
        .select('school, degree, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        count: count ?? 0,
        lastUpdated: recent?.created_at ?? null,
        mostRecent: recent ? `${recent.school}` : null,
      }
    },
  })

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return formatDistanceToNowStrict(new Date(dateString), { addSuffix: true })
  }

  const truncate = (text: string | null, maxLength: number = 30) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  // Skeleton loading card
  const SkeletonCard = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your resume data</p>
      </div>

      {/* Stats Summary Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Stats Summary</h2>
      </div>

      {/* Summary Cards */}
      <motion.div
        className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Categories Card */}
        {categoriesLoading ? (
          <SkeletonCard />
        ) : (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 transition-all duration-300"
          >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Folder className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-3">
                {categoriesStats?.count ?? 0}
              </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  Updated {formatRelativeTime(categoriesStats?.lastUpdated ?? null)}
                </p>
                <p className="text-xs text-gray-600 font-medium" title={categoriesStats?.mostRecent ?? undefined}>
                  Most recent: {truncate(categoriesStats?.mostRecent ?? null)}
                </p>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {/* Subcategories Card */}
        {subcategoriesLoading ? (
          <SkeletonCard />
        ) : (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 transition-all duration-300"
          >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Network className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-gray-600">Total Subcategories</p>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-3">
                {subcategoriesStats?.count ?? 0}
              </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  Updated {formatRelativeTime(subcategoriesStats?.lastUpdated ?? null)}
                </p>
                <p className="text-xs text-gray-600 font-medium" title={subcategoriesStats?.mostRecent ?? undefined}>
                  Most recent: {truncate(subcategoriesStats?.mostRecent ?? null)}
                </p>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {/* Skills Card */}
        {skillsLoading ? (
          <SkeletonCard />
        ) : (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 transition-all duration-300"
          >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-gray-600">Total Skills</p>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-3">
                {skillsStats?.count ?? 0}
              </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  Updated {formatRelativeTime(skillsStats?.lastUpdated ?? null)}
                </p>
                <p className="text-xs text-gray-600 font-medium" title={skillsStats?.mostRecent ?? undefined}>
                  Most recent: {truncate(skillsStats?.mostRecent ?? null)}
                </p>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {/* Experiences Card */}
        {experiencesLoading ? (
          <SkeletonCard />
        ) : (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 transition-all duration-300"
          >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-gray-600">Total Experiences</p>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-3">
                {experiencesStats?.count ?? 0}
              </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  Updated {formatRelativeTime(experiencesStats?.lastUpdated ?? null)}
                </p>
                <p className="text-xs text-gray-600 font-medium" title={experiencesStats?.mostRecent ?? undefined}>
                  Most recent: {truncate(experiencesStats?.mostRecent ?? null, 25)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
  )}
        {/* Education Card */}
      {educationLoading ? (
    <SkeletonCard />
  ) : (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100 transition-all        
  duration-300"
    >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-gray-600">Total Education</p>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-3">
                {educationStats?.count ?? 0}
              </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  Updated {formatRelativeTime(educationStats?.lastUpdated ?? null)}
                </p>
                <p className="text-xs text-gray-600 font-medium" title={educationStats?.mostRecent ?? undefined}>
                  Most recent: {truncate(educationStats?.mostRecent ?? null)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
  )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/categories">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <Folder className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Manage Categories</span>
            </Button>
          </Link>

          <Link to="/admin/subcategories">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <Network className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Manage Subcategories</span>
            </Button>
          </Link>

          <Link to="/admin/skills">
            <Button
              className="w-full justify-start gap-3 h-auto py-4 hover:bg-blue-700 transition-all duration-200"
            >
              <Code className="h-5 w-5" />
              <span className="font-medium">Manage Skills</span>
            </Button>
          </Link>

          <Link to="/admin/experiences">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Manage Experiences</span>
            </Button>
          </Link>

          <Link to="/admin/education">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Manage Education</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
