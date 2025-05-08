import { ApiService } from "./api.service";
import type { Product, ProductVariant } from "./products.service";

export interface CartItem {
  profile_id: number;
  product_variant_id: number;
  amount: number;
  product_variant?: ProductVariant;
}

export interface AddToCartRequest {
  product_variant_id: number;
  amount: number;
}

export interface UpdateCartRequest {
  amount: number;
}

export interface CartItemWithProduct extends CartItem {
  product_variant: ProductVariant & {
    product: Product;
  };
}

export interface GetCartResponse {
  carts: CartItemWithProduct[];
}

export interface AddToCartResponse {
  cart: CartItem;
}

export interface UpdateCartResponse {
  cart: CartItem;
}

export class CartService extends ApiService {
  /**
   * Get all items in the user's cart
   * @returns Array of cart items with product details
   */
  async getCart() {
    return this.get<GetCartResponse, any>('/cart');
  }

  /**
   * Add a product to the cart
   * @param data Product variant ID and amount
   * @returns The added cart item
   */
  async addToCart(data: AddToCartRequest) {
    return this.post<AddToCartResponse, any>('/cart', data);
  }

  /**
   * Update the quantity of a product in the cart
   * @param variantId Product variant ID
   * @param data New amount
   * @returns The updated cart item
   */
  async updateCartItem(variantId: number, data: UpdateCartRequest) {
    return this.put<UpdateCartResponse, any>(`/cart/${variantId}`, data);
  }

  /**
   * Remove a product from the cart
   * @param variantId Product variant ID
   * @returns Success message
   */
  async removeFromCart(variantId: number) {
    return this.delete<{ message: string }, any>(`/cart/${variantId}`);
  }
}

// Create and export a singleton instance
export const cartService = new CartService();