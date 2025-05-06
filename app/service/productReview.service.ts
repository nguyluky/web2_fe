import { ApiService } from "./api.service";

export interface Review {
  id?: number;
  product_id: number;
  user_id?: number;
  rating: number;
  comment: string;
  status?: string;
  meta_data?: any;
  created_at?: string;
  updated_at?: string;
}

export interface GetReviewResponse {
  reviews: Review[];
}

export class ProductReviewService extends ApiService {
  /**
   * Get reviews for a specific product
   * @param productId Product ID
   * @returns List of reviews for the product
   */
  async getReviewsByProductId(productId: number) {
    return this.get<GetReviewResponse, any>(`/products/${productId}/reviews`);
  }

  /**
   * Create a new review for a product
   * @param productId Product ID
   * @param data Review data (rating, comment)
   * @returns The created review
   */
  async createReview(productId: number, data: Review) {
    return this.post<Review, any>(`/products/${productId}/reviews`, data);
  }

  /**
   * Update an existing review
   * @param productId Product ID
   * @param reviewId Review ID
   * @param data Updated review data
   * @returns The updated review
   */
  async updateReview(productId: number, reviewId: number, data: Partial<Review>) {
    return this.put<Review, any>(`/products/${productId}/reviews/${reviewId}`, data);
  }

  /**
   * Delete a review
   * @param productId Product ID
   * @param reviewId Review ID
   * @returns Success message
   */
  async deleteReview(productId: number, reviewId: number) {
    return this.delete<{ message: string }, any>(`/products/${productId}/reviews/${reviewId}`);
  }
}

// Create and export a singleton instance
export const productReviewService = new ProductReviewService();
