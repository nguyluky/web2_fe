export interface ProductImage {
  id: number
  product_id: number
  variant_id: number | null
  image_url: string
  is_primary: boolean
  sort_order: number
  created_at: string
}