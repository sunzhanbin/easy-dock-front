import { mock, setup } from 'mockjs';

type Options = {
  body: any;
  type: 'GET' | 'POST' | 'DELETE';
  url: string;
};

setup({
  timeout: '200',
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

mock(/\/form\/subapp\/\w+\/components/, function () {
  return mock({
    resultCode: 0,
    'data|2-5': [
      {
        field: '@uuid',
        name: '@ctitle',
      },
    ],
  });
});

mock(/^\/user\/list/, 'post', function (options: Options) {
  const { data } = JSON.parse(options.body);

  return {
    resultCode: 0,
    data: data.map((item: string) => {
      return {
        avatar: `https://picsum.photos/100/100?t=${Math.random()}`,
        id: item,
        name: mock('@cname'),
      };
    }),
  };
});
