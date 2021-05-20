import { NodeType, UserNode } from './types';

function randomString() {
  return Math.random().toString(36).slice(2);
}

export function uuid(group: number = 3) {
  const strarr = Array.from(new Array(group)).map(() => randomString());

  return strarr.join('-');
}

export function fielduuid(group: number = 3) {
  // 应后端要求字段id不能以数字开头
  return `flow-node-${uuid(group)}`;
}

export function createNode(type: NodeType.UserNode, name: string): UserNode {
  return {
    id: fielduuid(),
    type,
    fieldsAuths: [],
    name,
    correlationMemberConfig: {
      departs: [],
      includeSubDeparts: true,
      members: [],
    },
  };
}
