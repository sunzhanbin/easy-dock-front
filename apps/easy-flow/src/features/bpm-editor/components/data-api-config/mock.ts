import { mock, setup } from 'mockjs';

type Options = {
  body: any;
  type: 'GET' | 'POST' | 'DELETE';
  url: string;
};

setup({
  timeout: '200',
});

function randomData(level: number) {
  if (level === 0) return [];

  level--;

  return mock({
    'data|1-3': [
      {
        'from|1': ['header', 'body', 'path', 'query'],
        name: '@word(3,10)',
        properties: () => {
          return randomData(Math.max(level, 0));
        },
        'required|1-5': true,
      },
    ],
  }).data;
}

mock(
  /\/api\/api-orchestration-service-main\/interfaceManage\/v1\/queryInterfaceInfo/,
  'get',
  function (options: Options) {
    return {
      resultCode: 0,
      data: {
        id: 13356415543808,
        name: '参数测试',
        requestMode: 'GET',
        responseType: null,
        headerContent: JSON.stringify(randomData(2)),
        requestParamContent: JSON.stringify([
          {
            hasRequired: 0,
            name: 'requestDTO',
            paramMode: 2,
            properties: randomData(4),
          },
        ]),
        responseParamContent: JSON.stringify(randomData(2)),
        requestExample: null,
        responseExampleSuccess: null,
        responseExampleFail: null,
      },
      resultMessage: '成功',
    };
  },
);

mock(/\/api\/api-orchestration-service-main\/interfaceManage\/v1\/listInfoForAll/, 'get', function (options: Options) {
  return mock({
    resultCode: 0,
    'data|5-10': [
      {
        name: '@cword(3,10)',
        id: '@integer',
      },
    ],
  });
});
