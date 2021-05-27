import { AbstractTooltipProps } from 'antd/lib/tooltip';
import { NodeType, AuditNode, FillNode, RevertType } from './types';

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

export function createNode(type: NodeType.AuditNode, name: string): AuditNode;
export function createNode(type: NodeType.FillNode, name: string): FillNode;
export function createNode(type: NodeType, name: string) {
  const node = {
    id: fielduuid(),
    type,
    fieldsAuths: {},
    name,
    correlationMemberConfig: {
      members: [],
    },
  };

  if (type === NodeType.AuditNode) {
    return <AuditNode>{
      ...node,
      btnText: {
        approve: { enable: true },
        revert: {
          enable: true,
        },
        save: {
          enable: true,
        },
      },
      revert: {
        type: RevertType.Start,
      },
    };
  } else if (type === NodeType.FillNode) {
    return <FillNode>node;
  } else {
    throw new Error('传入类型不正确');
  }
}

export const getPopupContainer: AbstractTooltipProps['getPopupContainer'] = (container) =>
  container;
