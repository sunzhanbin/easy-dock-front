import { mock, setup } from 'mockjs';

type Options = {
  body: any;
  type: 'GET' | 'POST' | 'DELETE';
  url: string;
};

setup({
  timeout: '200-2000',
});

mock(/\/fetch-flow\/\S+/, 'get', function (options: Options) {
  const slices = options.url.split('/');
  const appkey = slices[slices.length - 1];
  const localdata = localStorage.getItem(appkey);

  return {
    resultCode: 0,
    data: localdata ? JSON.parse(localdata) : null,
  };
});

mock(/\/save-flow/, 'post', function (options: Options) {
  const body = JSON.parse(options.body);

  localStorage.setItem(body.appkey, JSON.stringify(body.data));

  return {
    resultCode: 0,
    data: null,
  };
});
