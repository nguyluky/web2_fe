export interface ProductReview {
  id: number
  product_id: number
  user_id: number | null
  rating: number
  comment: string | null
  status: string | null
  meta_data: any | null
  created_at: string | null
  updated_at: string | null
}