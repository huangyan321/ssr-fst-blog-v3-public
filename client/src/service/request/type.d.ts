import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig
} from 'axios';

interface HyInterceptors<T = AxiosResponse> {
  requestInterceptors: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch: (err: any) => any;
  responseInterceptors: (config: T) => T;
  responseInterceptorsCatch: (config: any) => any;
}

export interface HyAxiosRequestConfig<T = AxiosResponse>
  extends AxiosRequestConfig {
  showLoading?: boolean;
  interceptors?: HyInterceptors<T>;
}
export interface DateType {
  code: number;
  data: any;
  msg: string;
}
