import { mock, setup } from 'mockjs';

export type subApp = {
  name: string;
  children: Array<{ key: string; value: string }>;
};

const appList: subApp[] = [
  {
    name: '请假审批',
    children: [
      { key: '审批1', value: '审批1' },
      { key: '审批2', value: '审批2' },
    ],
  },
  {
    name: '报销审批',
    children: [
      { key: '审批3', value: '审批3' },
      { key: '审批4', value: '审批4' },
    ],
  },
];

setup({
  timeout: '200',
});

mock(/\/fetchAppList/, 'get', function () {
  return {
    resultCode: 0,
    data: appList,
  };
});
