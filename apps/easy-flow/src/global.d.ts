type MockOptions<T = any> = {
  body: T;
  type: 'GET' | 'POST' | 'DELETE';
  url: string;
};

interface Window {
  __POWERED_BY_QIANKUN__: boolean | undefined;
  __webpack_public_path__: string;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
  COMMON_LOGIN_URL: string;
  COMMON_LOGIN_DOMAIN: string;
  EASY_DOCK_BASE_SERVICE_ENDPOINT: string;
}
