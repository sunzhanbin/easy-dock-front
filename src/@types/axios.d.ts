import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    silence?: boolean;
  }
}
