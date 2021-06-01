type MockOptions<T = any> = {
  body: T;
  type: 'GET' | 'POST' | 'DELETE';
  url: string;
};
