import { ApiService } from './api.service';

interface getProfileResponse {
    data: DataGet;
}

interface DataGet {
    id: number;
    fullname: string;
    phone_number: string;
    email: string;
}

interface UpdateProfileRequest {
    fullname: string;
    phone_number: string;
    email: string;
    avatar?: File;
}

interface UpdateProfileRequest {
    status: string;
    data: DataPut;
}

interface DataPut {
    id: number;
    fullname: string;
    phone_number: string;
    email: string;
    avatar: null;
}

export class ProfileService extends ApiService {
    async getProfile() {
        return this.get<getProfileResponse, any>('/users/profile');
    }

    // TODO: chua handle file
    async updateProfile(data: UpdateProfileRequest) {
        return this.post<UpdateProfileRequest, any>('/users/profile', data);
    }
}
