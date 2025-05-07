import { ApiService } from './api.service';

export interface ProductDetailResponse {
  product: Product
}

export interface Product {
  id: number
  sku: string
  name: string
  slug: string
  description: string
  category_id: number
  base_price: number
  base_original_price: number
  status: string
  specifications: string
  features: string
  meta_data: any
  created_at: string
  updated_at: string
  product_variants: ProductVariant[]
  product_images: ProductImage[]
  product_reviews: ProductReview[]
  category: Category
}

export interface ProductVariant {
  id: number
  product_id: number
  sku: string
  price: number
  original_price: number
  stock: number
  status: string
  attributes: string
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  variant_id: any
  image_url: string
  is_primary: boolean
  sort_order: number
  created_at: string
}


interface ProductReview {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  status: string;
  meta_data: null;
  created_at: string;
  updated_at: string;
  account: Account;
}

interface Account {
  id: number;
  username: string;
  rule: number;
  status: string;
  created: string;
  updated: string;
  deleted_at: null;
  profile: Profile;
}

interface Profile {
  id: number;
  fullname: string;
  phone_number: string;
  email: string;
  avatar: null;
}


export interface Category {
  id: number
  name: string
  slug: string
  status: string
  parent_id: number
  require_fields: any
  created_at: string
  updated_at: string
}

export interface NewProductsResponse {
  message: string
  data: Daum[]
}

export interface Daum {
  id: number
  sku: string
  name: string
  slug: string
  description: string
  category_id: number
  base_price: number
  base_original_price: number
  status: string
  specifications: string
  features: string
  meta_data: any
  created_at: string
  updated_at: string
}

export interface CategoryProductsResponse {
  product: Product[]
}

export interface SearchProductsParams {
  query?: string;
  limit?: number;
  sort?: 'created_at_desc' | 'created_at_asc' | 'price_asc' | 'price_desc';
}

export interface SearchProductsPagination {
  data: Product[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

export class ProductsService extends ApiService {
    /**
     * Get a list of newest products
     * @param page Page number
     * @param limit Number of products per page
     * @returns List of newest products
     */
    getNewProducts(page: number = 0, limit: number = 10) {
        return this.get<NewProductsResponse, any>(
            `/products/new?page=${page}&limit=${limit}`
        );
    }

    /**
     * Get detailed information about a specific product
     * @param id Product ID
     * @returns Product details with variants, images, reviews, and category
     */
    getProductsDetail(id: number) {
        return this.get<ProductDetailResponse, any>(
            `/products/${id}`
        );
    }

    /**
     * Get products by category ID
     * @param categoryId Category ID
     * @returns List of products in the specified category
     */
    getProductsByCategory(categoryId: number) {
        return this.get<CategoryProductsResponse, any>(
            `/categories/${categoryId}/products`
        );
    }

    /**
     * Search for products with various criteria
     * @param params Search parameters (query, limit, sort order)
     * @returns Paginated search results
     */
    searchProducts(params: SearchProductsParams = {}) {
        const queryParams = new URLSearchParams();
        
        if (params.query) queryParams.append('query', params.query);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.sort) queryParams.append('sort', params.sort);
        
        const queryString = queryParams.toString();
        const url = `/products/search${queryString ? `?${queryString}` : ''}`;
        
        return this.get<SearchProductsPagination, any>(url);
    }
}

// Create and export a singleton instance
export const productsService = new ProductsService();
