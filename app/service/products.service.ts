import { ApiService } from "./api.service"

export interface Products {
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
};

export interface ProductVariants {
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

export interface ProductImages {
  id: number
  product_id: number
  variant_id: any
  image_url: string
  is_primary: boolean
  sort_order: number
  created_at: string
}


export interface getProductsDetail extends Products {
  variants: ProductVariants[]
  images: ProductImages[]
}

export class ProductsService extends ApiService {
    getNewProducts(page: number = 0, limit: number = 10) {
        return this.get<{data: Products[], message: string}, any>(`/products/new?page=${page}&limit=${limit}`);
    }

    getProductsDetail(id: number) {
        return this.get<getProductsDetail, any>(`/products/${id}`);
    }

}
