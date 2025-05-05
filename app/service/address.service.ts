import { ApiService } from "./api.service"

export interface Address {
    profile_id: number
    phone_number: string
    street: string
    district: string
    ward: string
    city: string
}

export interface UserAddress {
  id: number
  profile_id: number
  phone_number: string
  street: string
  ward: string
  district: string
  city: string
}
  
export class AddressService extends ApiService {
    addNewAddress(address: Address) {
        const formBody = new URLSearchParams(address as any).toString();

        return this.post<{ data: Address }, any>(
            `/users/addresses`,
            formBody,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
    }

    getUserAddress() {
        return this.get<{ data: UserAddress[] }, any>(`/users/addresses`);
    }

    updateAddress(id: number, updatedData: Partial<UserAddress>) {
        const formBody = new URLSearchParams(updatedData as any).toString();

        return this.put<{ data: UserAddress }, any>(
            `/users/addresses/${id}`,
            formBody,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
    }

    deleteAddress(id: number) {
        return this.delete<{ message: string }, any>(`/users/addresses/${id}`);
    }
}