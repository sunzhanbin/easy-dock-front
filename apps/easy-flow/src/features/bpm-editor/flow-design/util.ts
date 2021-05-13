import {
  NodeType,
  BaseNode,
  StartNode,
  FillRange,
  TriggerType,
  AuditNode,
  FillNode,
  FinishNode,
  Flow,
} from './types';

function randomString() {
  return Math.random().toString(36).slice(2);
}

export function uuid(group: number = 3) {
  const strarr = Array.from(new Array(group)).map(() => randomString());

  return strarr.join('-');
}

export function fielduuid(group: number = 3) {
  // 应后端要求字段id不能以数字开头
  return `field-${uuid(group)}`;
}

type Fields = BaseNode['fieldsAuths'];

export function createNode(type: NodeType.StartNode, name: string, fields: Fields): StartNode;
export function createNode(type: NodeType.AuditNode, name: string, fields: Fields): AuditNode;
export function createNode(type: NodeType.FillNode, name: string, fields: Fields): FillNode;
export function createNode(type: NodeType.FinishNode, name: string, fields: Fields): FinishNode;
export function createNode(type: NodeType, name: string, fields: Fields) {
  let base: Omit<BaseNode, 'name'> = {
    id: fielduuid(),
    type,
    correlationMemberConfig: {
      departs: [],
      includeSubDeparts: true,
      members: [],
    },
    fieldsAuths: fields,
  };

  switch (type) {
    case NodeType.StartNode: {
      return <StartNode>{
        ...base,
        name,
        btnText: {
          submit: '提交',
        },
        fillRange: FillRange.WORKSPACE,
        trigger: TriggerType.MANUAL,
        next: null,
      };
    }

    case NodeType.AuditNode: {
      return <AuditNode>{
        ...base,
        name,
        btnText: {
          approve: '通过',
          reject: '拒绝',
          transfer: '转交',
          revert: '回退',
        },
        rule: {
          type: 1,
          signType: 1,
        },
        transfer: {
          enable: true,
          correlationMemberConfig: {
            departs: [],
            includeSubDeparts: true,
            members: [],
          },
          scope: 1,
        },
        next: null,
      };
    }

    case NodeType.FillNode: {
      return <FillNode>{
        ...base,
        name,
        next: null,
      };
    }

    case NodeType.FinishNode: {
      return <FinishNode>{
        ...base,
        name,
        notificationContent: '',
      };
    }
  }

  return undefined;
}

export function createInitialFlow(): Flow {
  const flow = createNode(NodeType.StartNode, '开始节点', []);
  const endNode = createNode(NodeType.FinishNode, '结束节点', []);

  return {
    ...flow,
    next: endNode,
  };
}
