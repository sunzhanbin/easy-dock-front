import { mock, setup } from "mockjs";

type Options = {
  body: any;
  type: "GET" | "POST" | "DELETE";
  url: string;
};

setup({
  timeout: "200",
});

function randomData(level: number) {
  if (level === 0) return [];

  level--;

  return mock({
    "data|1-3": [
      {
        "from|1": ["header", "body", "path", "query"],
        name: "@word(3,10)",
        properties: () => {
          return randomData(Math.max(level, 0));
        },
        "hasRequired|1": [0, 1],
      },
    ],
  }).data;
}

const head = JSON.stringify(randomData(2));
const body = JSON.stringify([
  {
    hasRequired: 0,
    name: "requestDTO",
    paramMode: 2,
    properties: randomData(2),
  },
]);
const resposne = JSON.stringify(randomData(2));

mock(
  /\/api\/api-orchestration-service-main\/interfaceManage\/v1\/queryInterfaceInfo/,
  "get",
  function (options: Options) {
    return {
      resultCode: 0,
      data: {
        id: 13356415543808,
        name: "参数测试",
        requestMode: "GET",
        responseType: null,
        headerContent: head,
        requestParamContent: body,
        responseParamContent: resposne,
        requestExample: null,
        responseExampleSuccess: null,
        responseExampleFail: null,
      },
      resultMessage: "成功",
    };
  },
);

const data = mock({
  "data|5-10": [
    {
      name: "@cword(3,10)",
      id: "@integer",
    },
  ],
});

mock(/\/api\/api-orchestration-service-main\/interfaceManage\/v1\/listInfoForAll/, "get", function (options: Options) {
  return mock({
    resultCode: 0,
    data: data.data,
  });
});
