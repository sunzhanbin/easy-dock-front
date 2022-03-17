import React from "react";
import { AbstractTooltipProps } from "antd/lib/tooltip";
import {
  NodeType,
  AllNode,
  AuditNode,
  FillNode,
  CCNode,
  BranchNode,
  SubBranch,
  AutoNodePushData,
  AutoNodeTriggerProcess,
  RevertType,
  AuthType,
  FieldAuthsMap,
  FieldTemplate,
  CorrelationMemberConfig,
  PluginNode,
  PluginDataConfig,
  NextAction,
} from "@type/flow";
import { FormMeta } from "@type";
import { validators } from "./validators";

function randomString() {
  return Math.random().toString(36).slice(2);
}

export function uuid(group = 3) {
  const strarr = Array.from(new Array(group)).map(() => randomString());

  return strarr.join("-");
}

export function fielduuid(group = 3) {
  // 应后端要求字段id不能以数字开头
  return `flow-node-${uuid(group)}`;
}

export function branchuuid(group = 3) {
  // 应后端要求字段id不能以数字开头
  return `flow-branch-${uuid(group)}`;
}

const nextAction: NextAction = {
  type: 1,
  conditions: [[{}]],
  failConfig: {
    type: 1,
    revert: {
      type: 1,
    },
  },
};

export function createNode(type: NodeType.AuditNode, name: string): AuditNode;
export function createNode(type: NodeType.FillNode, name: string): FillNode;
export function createNode(type: NodeType.CCNode, name: string): CCNode;
export function createNode(type: NodeType.PluginNode, name: string, dataConfig: PluginDataConfig): PluginNode;
export function createNode(type: NodeType.AutoNodePushData, name: string): AutoNodePushData;
export function createNode(type: NodeType.AutoNodeTriggerProcess, name: string): AutoNodeTriggerProcess;
export function createNode(type: NodeType.BranchNode): BranchNode;
export function createNode(type: NodeType.SubBranch): SubBranch;
export function createNode(type: NodeType, name?: string, dataConfig?: PluginDataConfig) {
  if (type === NodeType.SubBranch) {
    return {
      id: fielduuid(),
      type,
      conditions: [],
      nodes: [],
    } as SubBranch;
  }
  if (type === NodeType.BranchNode) {
    return {
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
    } as BranchNode;
  } else if (type === NodeType.AutoNodePushData) {
    return {
      id: fielduuid(),
      name,
      type,
      nextAction,
    } as AutoNodePushData;
  } else if (type === NodeType.AutoNodeTriggerProcess) {
    return {
      id: fielduuid(),
      name,
      type,
      triggerConfig: {
        isWait: false,
        subapps: [{ id: undefined, name: undefined, starter: { type: 1 }, mapping: [] }],
      },
    } as AutoNodeTriggerProcess;
  } else if (type === NodeType.PluginNode) {
    return {
      id: fielduuid(),
      type,
      name,
      dataConfig,
      nextAction,
    } as PluginNode;
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
    return {
      ...node,
      btnText: {
        approve: { enable: true },
        revert: { enable: true },
        save: { enable: true },
      },
      revert: {
        type: RevertType.Start,
      },
      dueConfig: {
        enable: false,
        timeout: {
          unit: "day",
        },
        notice: {
          starter: false,
          assign: false,
          admin: false,
          other: false,
        },
        cycle: {
          enable: false,
          unit: "day",
        },
        action: null,
      },
    } as AuditNode;
  } else if (type === NodeType.FillNode) {
    return {
      ...node,
      btnText: {
        submit: { enable: true },
        save: { enable: true },
      },
      dueConfig: {
        enable: false,
        timeout: {
          unit: "day",
        },
        notice: {
          starter: false,
          assign: false,
          admin: false,
          other: false,
        },
        cycle: {
          enable: false,
          unit: "day",
        },
      },
    } as FillNode;
  } else if (type === NodeType.CCNode) {
    return node as CCNode;
  } else {
    throw new Error("传入类型不正确");
  }
}

export const getPopupContainer: AbstractTooltipProps["getPopupContainer"] = (container) => container;

export function trimInputValue(event: React.ChangeEvent<HTMLInputElement>) {
  const value = event.target.value;

  return value ? value.trim() : "";
}

export function flowUpdate(data: AllNode[], targetId: string, newNode: AllNode | null): AllNode[] {
  const tIndex = data.findIndex((subNode) => subNode.id === targetId);

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
        const errors: string[] = [];

        const isInvalid = branch.conditions.some((row) => {
          return row.some(({ fieldName, symbol, value }) => {
            if (!fieldName || !symbol) {
              errors.push("条件配置不合法");
              return true;
            }
            if (
              !["null", "notNull"].includes(symbol) &&
              (value === null || value === undefined || (typeof value === "string" && value.trim() === ""))
            ) {
              errors.push("条件配置不合法");
              return true;
            }
            return false;
          });
        });

        if (errors.length && isInvalid) {
          validRes[branch.id] = {
            name: "子分支",
            id: branch.id,
            errors,
          };
        }
        valid(branch.nodes, validRes);
      });

      return;
    }

    const errors = [];
    if (!node.name) {
      errors.push("未输入节点名称");
    } else {
      const error = validators.name(node.name);

      if (error) {
        errors.push(error);
      }
    }

    // 审批节点、抄送节点、填写节点需要配置相关处理人
    if (node.type === NodeType.AuditNode || node.type === NodeType.FillNode || node.type === NodeType.CCNode) {
      const memberValidMessage = validators.member(node.correlationMemberConfig);

      if (node.type === NodeType.AuditNode) {
        const validRevertMessage = validators.revert(node.revert);

        if (validRevertMessage) {
          errors.push(validRevertMessage);
        }

        if (node.countersign && node.countersign.enable) {
          if (node.countersign.type === 1 && !node.countersign.percent) {
            errors.push("会签百分比不能为空");
          } else if (node.countersign.type === 2 && !node.countersign.count) {
            errors.push("会签人数不能为空");
          }
        }
      }
      // 审批节点和填写节点需要进行超时配置
      if (node.type !== NodeType.CCNode) {
        const timeoutValidMessage = validators.timeoutConfig(node.dueConfig!);
        if (timeoutValidMessage) {
          errors.push(timeoutValidMessage);
        }
      }

      if (memberValidMessage) {
        errors.push(memberValidMessage);
      }
    } else if (node.type === NodeType.AutoNodePushData) {
      const dataPushValidMessage = validators.data(node.dataConfig);

      if (dataPushValidMessage) {
        errors.push(dataPushValidMessage);
      }
      const nextActionMessage = validators.validateNextAction(node.nextAction);
      if (nextActionMessage) {
        errors.push(nextActionMessage);
      }
    } else if (node.type === NodeType.AutoNodeTriggerProcess) {
      const triggerConfigValidMessage = validators.config(node.triggerConfig.subapps);
      if (triggerConfigValidMessage) {
        errors.push(triggerConfigValidMessage);
      }
    } else if (node.type === NodeType.PluginNode) {
      const pluginParamsValidMessage = validators.validatePluginParams(node.dataConfig);
      if (pluginParamsValidMessage) {
        errors.push(pluginParamsValidMessage);
      }
      const nextActionMessage = validators.validateNextAction(node.nextAction);
      console.info(nextActionMessage);
      if (nextActionMessage) {
        errors.push(nextActionMessage);
      }
    }
    // 流程里程碑百分比校验
    if (
      node.type === NodeType.AuditNode ||
      node.type === NodeType.FillNode ||
      node.type === NodeType.CCNode ||
      node.type === NodeType.StartNode ||
      node.type === NodeType.AutoNodePushData ||
      node.type === NodeType.AutoNodeTriggerProcess ||
      node.type === NodeType.PluginNode
    ) {
      if (node.progress && node.progress.enable) {
        if (!node.progress.percent) {
          errors.push("流程里程碑百分比不能为空");
        }
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
    const finded = false;
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
    const { parentId, id } = item;
    if (parentId) {
      fieldsAuths[parentId] = Object.assign({}, fieldsAuths[parentId] || {}, { [id]: AuthType.View });
    } else {
      fieldsAuths[id] = AuthType.View;
    }

    return fieldsAuths;
  }, {} as FieldAuthsMap);
}

export function formatFieldsTemplate(form: FormMeta | null): FieldTemplate[] {
  if (!form || !form.components) return [];

  return form.components.map((field) => {
    return {
      name: field.config.label as string,
      type: field.config.type,
      id: field.config.id,
    };
  });
}

export function dynamicIsEmpty(data?: CorrelationMemberConfig["dynamic"]) {
  if (!data) return true;

  if (!data.starter && !data.fields.length && !data.roles.length) return true;

  return false;
}

// 获取对象的某个深层次属性
export const getProperty = (origin: any, nameList: string[]) => {
  if (!origin || !nameList?.length) {
    return null;
  }
  let result = null;
  let target = Object.assign({}, origin);
  while (nameList.length) {
    const name = nameList.shift()!;
    if (target && name) {
      result = target[name];
      target = result;
    } else {
      break;
    }
  }
  return result;
};

export const conditionSymbolMap = {
  equal: { value: "equal", label: "等于" },
  unequal: { value: "unequal", label: "不等于" },
  greater: { value: "greater", label: "大于" },
  greaterOrEqual: { value: "greaterOrEqual", label: "大于等于" },
  less: { value: "less", label: "小于" },
  lessOrEqual: { value: "lessOrEqual", label: "小于等于" },
  include: { value: "include", label: "包含" },
  exclude: { value: "exclude", label: "不包含" },
  null: { value: "null", label: "为空" },
  notNull: { value: "notNull", label: "不为空" },
  stringLength: { value: "stringLength", label: "字符长度" },
  arrayLength: { value: "arrayLength", label: "数据个数" },
  true: { value: "true", label: "是" },
  false: { value: "false", label: "否" },
  before: { value: "before", label: "早于" },
  after: { value: "after", label: "晚于" },
  year: { value: "year", label: "所在年为" },
  month: { value: "month", label: "所在月为" },
  day: { value: "day", label: "所在日为" },
  hour: { value: "hour", label: "所在时为" },
  minute: { value: "minute", label: "所在分为" },
  second: { value: "second", label: "所在秒为" },
};
