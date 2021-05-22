import { mock } from 'mockjs';
import { NodeType, TriggerType, AllNode } from './types';

const flow: AllNode[] = [
  {
    id: 'field-xxxxxx1',
    type: NodeType.StartNode,
    name: '开始节点',
    trigger: {
      type: TriggerType.MANUAL,
    },
  },
  {
    id: 'field-xxx2',
    name: '请假审批',
    type: NodeType.UserNode,
    btnText: {
      approve: {
        enable: true,
        text: '审批通过',
      },
    },
    fieldsAuths: [
      {
        id: '表单字段id',
        auth: 1,
      },
    ],
    correlationMemberConfig: {
      departs: [{ id: 1, name: '部门名称' }],
      includeSubDeparts: true,
      members: [{ name: '张三', id: 1, avatar: '用户头像' }],
    },
  },
  {
    id: 'field-xxxx3',
    type: NodeType.BranchNode,
    branches: [
      {
        id: 'branchid-2222',
        conditions: [],
        nodes: [
          {
            id: 'field-xxx4',
            name: '采购审批',
            type: NodeType.UserNode,
            btnText: {
              revert: {
                enable: true,
                text: '审批驳回',
              },
            },
            revert: {
              type: 1,
              nodeId: '驳回到节点的ID',
            },
            fieldsAuths: [
              {
                id: '表单字段id',
                auth: 1,
              },
            ],
            correlationMemberConfig: {
              departs: [{ id: 1, name: '部门名称' }],
              includeSubDeparts: true,
              members: [{ name: '张三', id: 1, avatar: '用户头像' }],
            },
          },
          {
            id: 'fielx-1111',
            type: NodeType.BranchNode,
            branches: [
              {
                id: 'branchid-1111',
                conditions: [],
                nodes: [
                  {
                    id: 'field-xxx566',
                    name: '请假-----审批',
                    type: NodeType.UserNode,
                    btnText: {
                      approve: {
                        enable: true,
                        text: '审批通过',
                      },
                    },
                    fieldsAuths: [
                      {
                        id: '表单字段id',
                        auth: 1,
                      },
                    ],
                    correlationMemberConfig: {
                      departs: [{ id: 1, name: '部门名称' }],
                      includeSubDeparts: true,
                      members: [{ name: '张三', id: 1, avatar: '用户头像' }],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'branchid-3333',
        conditions: [],
        nodes: [
          {
            id: 'field-xxx5',
            name: '请假审批',
            type: NodeType.UserNode,
            btnText: {
              approve: {
                enable: true,
                text: '审批通过',
              },
            },
            fieldsAuths: [
              {
                id: '表单字段id',
                auth: 1,
              },
            ],
            correlationMemberConfig: {
              departs: [{ id: 1, name: '部门名称' }],
              includeSubDeparts: true,
              members: [{ name: '张三', id: 1, avatar: '用户头像' }],
            },
          },
          {
            id: 'field-xxx6',
            name: '请假审批',
            type: NodeType.UserNode,
            btnText: {
              approve: {
                enable: true,
                text: '审批通过',
              },
            },
            fieldsAuths: [
              {
                id: '表单字段id',
                auth: 1,
              },
            ],
            correlationMemberConfig: {
              departs: [{ id: 1, name: '部门名称' }],
              includeSubDeparts: true,
              members: [{ name: '张三', id: 1, avatar: '用户头像' }],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'field-xxxx7',
    name: '结束节点',
    type: NodeType.FinishNode,
    notificationContent: '通知内容',
  },
];

type Options = {
  body: any;
  type: 'GET' | 'POST' | 'DELETE';
  url: string;
};

mock(/\/fetch-flow\/\S+/, 'get', function () {
  return {
    resultCode: 0,
    // data: flow,
    data: null,
  };
});
