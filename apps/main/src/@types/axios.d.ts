import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    silence?: boolean;
  }
  export interface AxiosResponse {
    resultMessage: string;
  }
}
