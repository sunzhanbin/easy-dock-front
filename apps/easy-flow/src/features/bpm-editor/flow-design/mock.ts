import { mock } from 'mockjs';
import { NodeType, TriggerType, FillRange } from './types';

type Options = {
  body: any;
  type: 'GET' | 'POST' | 'DELETE';
  url: string;
};

mock(/\/fetch-flow\/\S+/, 'get', function () {
  return {
    resultCode: 0,
    // data: {
    //   id: 1,
    //   name: '申请人',
    //   type: NodeType.StartNode,
    //   trigger: TriggerType.MANUAL,
    //   fieldsAuths: [],
    //   fillRange: FillRange.WORKSPACE,
    //   btnText: {
    //     submit: '提交',
    //   },
    //   correlationMemberConfig: {
    //     departs: [],
    //     members: [],
    //     includeSubDeparts: true,
    //   },
    //   next: null,
    // },
    data: null,
  };
});
