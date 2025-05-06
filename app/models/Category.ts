export interface Category {
  id: number
  name: string
  slug: string
  status: string | null
  parent_id: number | null
  require_fields: any | null
  created_at: string
  updated_at: string
}