import { ApiService } from "./api.service"

export interface Carts {
    carts: Cart[]
}

export interface Cart {
  profile_id: number
  product_variant_id: number
  amount: number
}
  
  
export class CartService extends ApiService {
    getAllCart() {
        return this.get<{data : Carts}, any>(`/cart`);
    }

    addCart() {

    }

    updateCart(variant_id: number) {
        
    }

    deleteCart(variant_id: number) {

    }
}