export interface OrderDetail {
  id: number
  order_id: number
  product_variant_id: number
  serial: number
}

export interface Order {
  id: number
  account_id: number
  employee_id: number
  status: string
  payment_method: string
  created_at: string | null
}