import { mock, setup } from "mockjs";
import { TableDataBase } from "./index";

type Options = {
  body: any;
  type: "GET" | "POST" | "DELETE";
  url: string;
};

setup({
  timeout: "200",
});

const taskDb: TableDataBase[] = mock({
  "data|30-100": [
    {
      processInstanceId: "@guid",
      starter: "@cname",
      startTime: "@integer(1623311653531, 1631951634046)",
      "state|1": [1, 2, 3, 4, 5],
      formData: {
        phone: /1\d{10}/,
        "timeRange|2": ["@integer(1623311653531, 1631951634046)"],
        applyTime: "@integer(1623311653531, 1631951634046)",
        "members|1-5": ["@guid"],
        "size|1-3": ["@cword(2,4)"],
      },
    },
  ],
}).data;

mock(/\/task\/processDataManager\/list/, "post", function (options: Options) {
  const data = JSON.parse(options.body);
  const { pageSize, pageIndex, stateList, sortDirection } = data;
  const list = [...taskDb]
    .sort((prev, next) => {
      if (sortDirection === "ASC") {
        return prev.startTime - next.startTime;
      }

      return next.startTime - prev.startTime;
    })
    .filter((item) => stateList.find((state: TableDataBase["state"]) => state === item.state));

  return {
    resultCode: 0,
    data: {
      data: list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
      recordTotal: list.length,
    },
    resultMessage: "成功",
  };
});

mock(/\/subapp\/\d+\/list\/all/, "get", function () {
  return mock({
    resultCode: 0,
    "data|10-20": [
      {
        id: "@id",
        name: "@cword(5,20)",
        type: 2,
        status: 1,
      },
    ],
  });
});

mock(/\/user\/query\/owner/, "post", function (options: Options) {
  const data = JSON.parse(options.body);
  const { userIds } = data;

  return mock({
    resultCode: 0,
    data: {
      users: userIds.map((id: string) => {
        return {
          id,
          userName: mock("@cname"),
        };
      }),
    },
  });
});

mock(/\/form\/subapp\/\d+\/all\/components/, "get", function () {
  return mock({
    resultCode: 0,
    data: [
      {
        field: "phone",
        name: "手机号",
        type: "Input",
      },
      {
        field: "applyTime",
        type: "Date",
        name: "日期组件",
      },
      {
        field: "timeRange",
        type: "Date",
        name: "日期组件带范围",
      },
      {
        field: "members",
        type: "Member",
        name: "人员组件",
      },
      {
        field: "size",
        type: "Checkbox",
        name: "下拉选",
      },
    ],
  });
});
