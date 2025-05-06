export interface ProductVariant {
  id: number
  product_id: number
  sku: string | null
  price: number
  original_price: number | null
  stock: number | null
  status: string | null
  attributes: any
  created_at: string | null
  updated_at: string | null
}