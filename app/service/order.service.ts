import { ApiService } from "./api.service"

export interface UserOrder {
    current_page: number
    data: Order[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Link[]
    next_page_url: any
    path: string
    per_page: number
    prev_page_url: any
    to: number
    total: number
}

export interface Link {
  url?: string
  label: string
  active: boolean
}

export interface OrderDetails {
    orderDetail: OrderDetail[]
}

export interface Order {
    id: number
    account_id: number
    status: string
    created_at: string
    employee_id: number
    payment_method: string
}
  
export interface OrderDetail {
  id: number
  order_id: number
  product_variant_id: number
  serial: number
}

export class OrderService extends ApiService {
    //Them san pham POST // chua lam

    getUserOrder(page: number = 0, limit: number = 10) {
        return this.get<{data: UserOrder}, any>(`/user/orders?page=${page}&limit=${limit}`);
    }

    getOrderDetail(id: number) {
        return this.get<{data: OrderDetails}, any>(`/orders/${id}`);
    }

    cancelOrder(id: number) {
        return this.put<{data: Order}, any>(`/orders/${id}/cancel`);
    }
}