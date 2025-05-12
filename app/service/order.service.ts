import type { Product } from "~/models/Product";
import type { ProductVariant } from "~/models/ProductVariant";
import { ApiService } from "./api.service";

export interface OrderProduct {
  product_variant_id: number;
}


export interface CreateOrderRequest {
  products: {
    product_variant_id: number;
    // Có thể bổ sung thêm các thuộc tính khác của products nếu cần
  }[];
  payment_method: number;
  address_id: number;
}

export interface OrderStatus {
  status: string;
}

export interface CheckOrderStatusRequest {
  order_id: number;
}

export interface Order {
  id: number;
  account_id: number;
  employee_id: number;
  status: string;
  payment_method: number;
  created_at: string;
  updated_at: string;
}

export interface OrderResponse {
  order: Order;
}

export interface OrderDetail {
  id: number;
  order_id: number;
  product: Product;
  variant: ProductVariant;
  amount: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface OrderDetailsResponse {
  orderDetail: OrderDetail[];
}

export interface UserOrdersParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export interface UserOrdersPagination {
  data: Order[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

export class OrderService extends ApiService {
  /**
   * Create a new order
   * @param data Order data including products
   * @returns Created order information
   */
  async createOrder(data: CreateOrderRequest) {
    return this.post<OrderResponse, any>('/orders', data);
  }

  /**
   * Check the payment status of an order
   * @param data Order ID to check
   * @returns Status information
   */
  async checkOrderStatus(data: CheckOrderStatusRequest) {
    return this.post<{ status: string }, any>('/orders/check-status', data);
  }

  /**
   * Get delivery information (not fully implemented in API)
   * @returns Information message
   */
  async getDeliveryInfo() {
    return this.get<{ message: string }, any>('/orders/delivery-info');
  }

  /**
   * Purchase a product immediately
   * @param data Order data including products
   * @returns Created order information
   */
  async buyNow(data: CreateOrderRequest) {
    return this.post<OrderResponse, any>('/orders/buy-now', data);
  }

  /**
   * Get all orders for the current authenticated user
   * @param params Pagination and filter parameters
   * @returns Paginated list of orders
   */
  async getUserOrders(params?: UserOrdersParams) {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = `/users/orders${queryString ? `?${queryString}` : ''}`;
    
    return this.get<UserOrdersPagination, any>(url);
  }

  /**
   * Get details of a specific order
   * @param id Order ID
   * @returns Order details including products
   */
  async getOrderDetail(id: number) {
    return this.get<OrderDetailsResponse, any>(`/orders/${id}`);
  }

  /**
   * Cancel an order
   * @param id Order ID to cancel
   * @returns Updated order information
   */
  async cancelOrder(id: number) {
    return this.put<Order, any>(`/orders/${id}/cancel`, {});
  }
}

// Create and export a singleton instance
export const orderService = new OrderService();