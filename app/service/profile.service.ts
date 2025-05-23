import type { Profile } from '~/models/Profile';
import { ApiService } from './api.service';

export interface getProfileResponse {
    data: Profile;
}

interface UpdateProfileRequest {
    fullname: string;
    phone_number: string;
    email: string;
    avatar?: File;
}

interface UpdateProfileResponse {
    status: string;
    data: Profile;
}


export class ProfileService extends ApiService {
    async getProfile() {
        return this.get<getProfileResponse, any>('/users/profile');
    }

    async updateProfile(data: UpdateProfileRequest) {
        return this.put<UpdateProfileResponse, any>('/users/profile', data);
    }
    
    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('avatar', file);
        return this.post<UpdateProfileResponse, FormData>('/users/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}
