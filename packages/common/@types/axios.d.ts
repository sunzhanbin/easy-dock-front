import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    silence?: boolean;
  }
  export interface AxiosResponse {
    resultMessage: string;
  }

  export interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}
