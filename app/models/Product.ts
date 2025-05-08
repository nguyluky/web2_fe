export interface Product {
  id: number
  sku: string | null
  name: string
  slug: string
  description: string | null
  category_id: number | null
  base_price: number
  base_original_price: number | null
  status: string | null
  specifications: string | any
  features: string | any
  meta_data: any | null
  created_at: string | null
  updated_at: string | null
}