import { ApiService } from "./api.service"

export interface Address {
    profile_id: number
    phone_number: string
    street: string
    district: string
    ward: string
    city: string
}

export interface UserAddress extends Address {
  id: number
}
  
export class AddressService extends ApiService {
    addNewAddress(address: Address) {
        const formData = new FormData();
        Object.entries(address).forEach(([key, value]) => {
            formData.append(key, String(value));
        });
       
        return this.post<{ data: Address }, any>(`/users/addresses`, formData);
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