import { ApiService } from "./api.service";
import type { Product } from "./products.service";

export interface Category {
  id: number;
  name: string;
  slug: string;
  status: string;
  parent_id: number;
  require_fields: any;
  created_at: string;
  updated_at: string;
}

export interface GetCategoriesResponse {
  data: Category[];
}

export interface CategoryProductsResponse {
  product: Product[];
}

export class CategoryService extends ApiService {
  /**
   * Get all categories
   * @returns List of all categories
   */
  async getCategories() {
    return this.get<GetCategoriesResponse, any>('/categories');
  }

  /**
   * Get a specific category by ID
   * @param id Category ID
   * @returns Category details
   */
  async getCategory(id: number) {
    return this.get<{ data: Category }, any>(`/categories/${id}`);
  }

  /**
   * Get all products in a specific category
   * @param id Category ID
   * @returns List of products in the category
   */
  async getCategoryProducts(id: number) {
    return this.get<CategoryProductsResponse, any>(`/categories/${id}/products`);
  }
}

// Create and export a singleton instance
export const categoryService = new CategoryService();