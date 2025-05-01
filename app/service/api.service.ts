import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Base API URL
const API_URL = 'http://localhost:8000/api';

// Create a custom axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API service class
export class ApiService {
  protected async get<T, E>(url: string, config?: AxiosRequestConfig): Promise<[(T | null), (E | null)]> {
    try {
        const response: AxiosResponse<T> = await apiClient.get(url, config);
        return [response.data, null];
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            const errorResponse = error.response as AxiosResponse<E>;
            return [null, errorResponse?.data || null];
        }
        
        throw error; // Rethrow if it's not an Axios error
    }
  }

  protected async post<T, E>(url: string, data?: any, config?: AxiosRequestConfig): Promise<[(T | null), (E | null)]> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return [response.data, null];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response as AxiosResponse<E>;
        return [null, errorResponse?.data || null];
      }
      
      throw error; // Rethrow if it's not an Axios error
    }
  }

  protected async put<T, E>(url: string, data?: any, config?: AxiosRequestConfig): Promise<[(T | null), (E | null)]> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data, config);
      return [response.data, null];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response as AxiosResponse<E>;
        return [null, errorResponse?.data || null];
      }
      
      throw error; // Rethrow if it's not an Axios error
    }
  }

  protected async patch<T, E>(url: string, data?: any, config?: AxiosRequestConfig): Promise<[(T | null), (E | null)]> {
    try {
      const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
      return [response.data, null];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response as AxiosResponse<E>;
        return [null, errorResponse?.data || null];
      }
      
      throw error; // Rethrow if it's not an Axios error
    }
  }

  protected async delete<T, E>(url: string, config?: AxiosRequestConfig): Promise<[(T | null), (E | null)]> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, config);
      return [response.data, null];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response as AxiosResponse<E>;
        return [null, errorResponse?.data || null];
      }
      
      throw error; // Rethrow if it's not an Axios error
    }
  }
}
