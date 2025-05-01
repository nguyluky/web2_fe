import { ApiService } from "./api.service";

export interface Profile {
  id: number;
  fullname: string;
  phone_number: string;
  email: string;
  avatar: string;
}

interface UpdateProfileRequest {
  fullname: string;
  phone_number: string;
  email: string;
  avatar?: File;
}

export class ProfileService extends ApiService {
    async getProfile() {
        return this.get<Profile, any>('/users/profile');
    }
    
    // TODO: chua handle file
    async updateProfile(data: UpdateProfileRequest) {
        const formData = new FormData();
        formData.append('fullname', data.fullname);
        formData.append('phone_number', data.phone_number);
        formData.append('email', data.email);
        if (data.avatar) {
        formData.append('avatar', data.avatar);
        }
        return this.post<Profile, any>('/users/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
    }
}
