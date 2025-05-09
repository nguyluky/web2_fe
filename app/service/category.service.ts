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


interface GetFilterResponse {
  data: {[key: string]: string[]};
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

  async getFilterCategory(id: number) {
    return this.get<GetFilterResponse, any>(`/categories/${id}/filter`);
  }
}

// Create and export a singleton instance
export const categoryService = new CategoryService();