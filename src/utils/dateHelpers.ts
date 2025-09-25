export function fmtYear(date: string | null): string {
  if (!date) return 'Present'
  return new Date(date).getFullYear().toString()
}

export function formatDateRange(startDate: string, endDate: string | null): string {
  return `${fmtYear(startDate)} - ${fmtYear(endDate)}`
}