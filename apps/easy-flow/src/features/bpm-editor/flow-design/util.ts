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
  AutoNode,
  RevertType,
  AuthType,
  FieldAuthsMap,
  FieldTemplate,
} from '@type/flow';
import { validName } from '@common/rule';
import { FormMeta } from '@type';

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
export function createNode(type: NodeType.AutoNode, name: string): AutoNode;
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
  } else if (type === NodeType.AutoNode) {
    return <AutoNode>{
      id: fielduuid(),
      name,
      type,
    };
  }
  const node = {
    id: fielduuid(),
    type,
    fieldsAuths: {},
    name,
    correlationMemberConfig: {
      members: [],
      depts: [],
      roles: [],
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

type PrevNodeType = Exclude<AllNode, BranchNode>;

export const findPrevNodes = (flow: AllNode[], targetId: string): PrevNodeType[] => {
  function findPrevNodes(flow: AllNode[], targetId: string): [PrevNodeType[], boolean] {
    let finded = false;
    let prevs: PrevNodeType[] = [];

    const targetNodeIndex = flow.findIndex((node) => {
      if (finded) return true;

      if (node.id === targetId) {
        return true;
      }

      if (node.type === NodeType.BranchNode) {
        // 进入分支节点
        // 缓存遍历过的节点
        const caches: PrevNodeType[][] = [];
        const targetBranchIndex = node.branches.findIndex((branch, index) => {
          // 进入子分支
          const [nodes, success] = findPrevNodes(branch.nodes, targetId);

          caches[index] = nodes;

          return success;
        });

        if (targetBranchIndex !== -1) {
          // 如果在某一分支下找到了目标节点, 那么其他分支里的节点就不是目标节点上面的节点
          prevs = prevs.concat(caches[targetBranchIndex]);
        } else {
          // 如果没在该分支节点下找到那么把所有遍历过的节点全部都是目标节点的上面的节点
          caches.forEach((nodes) => {
            prevs = prevs.concat(nodes);
          });
        }

        return targetBranchIndex !== -1;
      } else {
        // 分支节点不要插入
        prevs.push(node);
      }

      return false;
    });

    return [prevs, targetNodeIndex !== -1];
  }

  const [nodes, success] = findPrevNodes(flow, targetId);

  return success ? nodes : [];
};

export function formatFieldsAuths(fieldsTemplate: FieldTemplate[]) {
  return fieldsTemplate.reduce((fieldsAuths, item) => {
    fieldsAuths[item.id] = AuthType.View;

    return fieldsAuths;
  }, <FieldAuthsMap>{});
}

export function formatFieldsTemplate(form: FormMeta | null): FieldTemplate[] {
  if (!form || !form.components) return [];

  return form.components.map((field) => {
    return {
      name: field.config.label as string,
      type: field.config.type,
      id: field.config.id as string,
    };
  });
}
