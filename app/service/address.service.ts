import { ApiService } from "./api.service";


export interface UserAddress {
  id: number;
  profile_id: number;
  phone_number: string;
  email: string;
  name: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}
  
export class AddressService extends ApiService {
    addNewAddress(address: Omit<UserAddress, 'id' | 'profile_id'>) {
        const formBody = new URLSearchParams(address as any).toString();

        return this.post<{ data: UserAddress }, any>(
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
        return this.get<UserAddress[], any>(`/users/addresses`);
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