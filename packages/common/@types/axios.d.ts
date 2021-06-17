import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    silence?: boolean;
  }
  export interface AxiosResponse {
    resultMessage: string;
  }

  type ApiResponseSchema = {
    resultCode: number;
    resultMessage: string;
    data?: any;
  };

  export interface AxiosInstance {
    get<T = ApiResponseSchema>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = ApiResponseSchema>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = ApiResponseSchema>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = ApiResponseSchema>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}
