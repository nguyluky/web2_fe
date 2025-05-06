import { ApiService } from "./api.service";


export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    fullname: string;
    phone_number: string;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface RegisterResponse extends LoginResponse {}

export interface LoginErrorResponse {
    message: string;
    errors: {[key: string]: string[]};
}

interface RegisterErrorResponse extends LoginErrorResponse { }

export class AuthService extends ApiService {
    async login(data: LoginRequest) {
        return this.post<LoginResponse, LoginErrorResponse>('/auth/login', data);
    }

    async register(data: RegisterRequest) {
        return this.post<RegisterResponse, RegisterErrorResponse>('/auth/register', data);
    }

    async logout() {
        return this.post<void, any>('/auth/logout');
    }
    // TODO: Implement other auth-related methods as needed
}