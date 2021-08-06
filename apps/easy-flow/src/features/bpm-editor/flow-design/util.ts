import React from 'react';
import { AbstractTooltipProps } from 'antd/lib/tooltip';
import {
  NodeType,
  AllNode,
  AuditNode,
  FillNode,
  CCNode,
  BranchNode,
  SubBranch,
  RevertType,
  AuthType,
  FieldAuthsMap,
  FieldTemplate,
} from '@type/flow';
import { validName } from '@common/rule';

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

export function branchuuid(group: number = 3) {
  // 应后端要求字段id不能以数字开头
  return `flow-branch-${uuid(group)}`;
}

export function createNode(type: NodeType.AuditNode, name: string): AuditNode;
export function createNode(type: NodeType.FillNode, name: string): FillNode;
export function createNode(type: NodeType.CCNode, name: string): CCNode;
export function createNode(type: NodeType.BranchNode): BranchNode;
export function createNode(type: NodeType.SubBranch): SubBranch;
export function createNode(type: NodeType, name?: string) {
  if (type === NodeType.SubBranch) {
    return <SubBranch>{
      id: fielduuid(),
      type,
      conditions: [],
      nodes: [],
    };
  }
  if (type === NodeType.BranchNode) {
    return <BranchNode>{
      type,
      id: fielduuid(),
      branches: [
        {
          id: branchuuid(),
          nodes: [],
          conditions: [],
          type: NodeType.SubBranch,
        },
        {
          id: branchuuid(),
          nodes: [],
          conditions: [],
          type: NodeType.SubBranch,
        },
      ],
    };
  }
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
        revert: { enable: true },
        save: { enable: true },
      },
      revert: {
        type: RevertType.Start,
      },
    };
  } else if (type === NodeType.FillNode) {
    return <FillNode>{
      ...node,
      btnText: {
        submit: { enable: true },
        save: { enable: true },
      },
    };
  } else if (type === NodeType.CCNode) {
    return <CCNode>node;
  } else {
    throw new Error('传入类型不正确');
  }
}

export const getPopupContainer: AbstractTooltipProps['getPopupContainer'] = (container) => container;

export function trimInputValue(event: React.ChangeEvent<HTMLInputElement>) {
  const value = event.target.value;

  return value ? value.trim() : '';
}

export function flowUpdate(data: AllNode[], targetId: string, newNode: AllNode | null): AllNode[] {
  let tIndex = data.findIndex((subNode) => subNode.id === targetId);

  if (tIndex >= 0) {
    // 删除
    if (!newNode) {
      return data.slice(0, tIndex).concat(data.slice(tIndex + 1));
    }

    if (newNode.id === targetId) {
      // 更新
      return data
        .slice(0, tIndex)
        .concat(newNode)
        .concat(data.slice(tIndex + 1));
    } else {
      // 插入
      return data
        .slice(0, tIndex + 1)
        .concat(newNode)
        .concat(data.slice(tIndex + 1));
    }
  } else {
    return data.map((subNode) => {
      if (subNode.type === NodeType.BranchNode) {
        return {
          ...subNode,
          branches: subNode.branches.map((subBranch) => {
            let subnodes = subBranch.nodes;

            if (targetId === subBranch.id && newNode) {
              subnodes = [newNode].concat(subnodes);
            } else {
              subnodes = flowUpdate(subBranch.nodes, targetId, newNode);
            }

            return {
              ...subBranch,
              nodes: subnodes,
            };
          }),
        };
      } else {
        return subNode;
      }
    });
  }
}

export function branchUpdate(data: AllNode[], target: SubBranch): AllNode[] {
  return data.map((subNode) => {
    if (subNode.type === NodeType.BranchNode) {
      return {
        ...subNode,
        branches: subNode.branches.map((sBranch) => {
          if (sBranch.id === target.id) {
            return target;
          }

          return {
            ...sBranch,
            nodes: branchUpdate(sBranch.nodes, target),
          };
        }),
      };
    }

    return subNode;
  });
}

export type ValidResultType = {
  [key: string]: {
    errors: string[];
    id: string;
    name: string;
  };
};

export function valid(data: AllNode[], validRes: ValidResultType) {
  data.forEach((node) => {
    if (node.type === NodeType.BranchNode) {
      node.branches.forEach((branch) => {
        valid(branch.nodes, validRes);
      });
      return;
    }

    const errors = [];

    if (!node.name) {
      errors.push('未输入节点名称');
    } else {
      const error = validName(node.name);
      if (error) {
        errors.push(error);
      }
    }

    if (node.type === NodeType.StartNode) {
    } else if (node.type === NodeType.AuditNode) {
      if (!node.correlationMemberConfig.members.length) {
        errors.push('请选择办理人');
      }
    } else if (node.type === NodeType.FillNode) {
      if (!node.btnText || Object.keys(node.btnText).length === 0) {
        errors.push('请配置按钮');
      }

      if (!node.correlationMemberConfig.members.length) {
        errors.push('请选择办理人');
      }
    }

    if (errors.length) {
      validRes[node.id] = {
        errors,
        id: node.id,
        name: node.name,
      };
    }
  });

  return validRes;
}

export const findPrevNodes = (() => {
  let finded = false;

  return function findPrevNodes(flow: AllNode[], targetId: string, prevs: AllNode[]) {
    flow.find((node) => {
      if (node.id === targetId) {
        finded = true;

        return true;
      }

      prevs.push(node);

      if (node.type === NodeType.BranchNode) {
        // 进入分支节点
        node.branches.find((branch) => {
          // 进入子分支
          findPrevNodes(branch.nodes, targetId, prevs);

          if (!finded) {
            // 回朔掉之前加入的节点
            prevs = prevs.slice(0, -1 * branch.nodes.length);

            return false;
          } else {
            return true;
          }
        });
      }

      return false;
    });

    return prevs;
  };
})();

export function getFieldsTemplate(fieldsTemplate: FieldTemplate[]) {
  return fieldsTemplate.reduce((fieldsAuths, item) => {
    fieldsAuths[item.id] = AuthType.View;

    return fieldsAuths;
  }, <FieldAuthsMap>{});
}
