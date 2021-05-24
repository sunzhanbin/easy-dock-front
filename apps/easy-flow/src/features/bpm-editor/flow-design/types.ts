import { MemberConfig } from '@type';

export enum NodeType {
  // 开始节点
  StartNode = 1,
  // 用户节点
  UserNode = 2,
  // 分支节点
  BranchNode = 3,
  // 结束节点
  FinishNode = 4,
}

// @auth: 0不可见 1仅可见 2可编辑
export type FieldAuth = { id: string; auth: 1 | 2 | 0 };
// 节点基本类型
export interface BaseNode {
  id: string;
  type: NodeType;
  name: string;
}

export type AllNode = StartNode | UserNode | BranchNode | FinishNode;

export type ButtonAuth = {
  enable?: boolean;
  text?: string;
};

export enum RevertType {
  Start = 1,
  Prev = 2,
  Specify = 3,
}

// 审批节点
export interface UserNode extends BaseNode {
  type: NodeType.UserNode;
  btnText?: {
    approve?: ButtonAuth;
    revert?: ButtonAuth;
    submit?: ButtonAuth;
    save?: ButtonAuth;
    transfer?: ButtonAuth;
    finish?: ButtonAuth;
  };
  correlationMemberConfig: MemberConfig;
  fieldsAuths: FieldAuth[];
  revert?: {
    type: RevertType;
    nodeId?: string;
  };
  signRule?: {
    tpye: 1 | 2;
    config: {};
  };
}

// 0等于 1不等于 2包含 3不包含
type JudgeType = 0 | 1 | 2 | 3;
type DataType = 0 | 1 | 2;

type BranchCondition = {
  title: string;
  dataType: DataType;
  judgeType: JudgeType;
  values: string[];
  details: [];
};
// 分支节点
export interface BranchNode {
  id: string;
  type: NodeType.BranchNode;
  branches: { id: string; nodes: AllNode[]; conditions: BranchCondition[] }[];
}

export interface FinishNode extends BaseNode {
  type: NodeType.FinishNode;
  notificationContent: string;
}

export enum TriggerType {
  MANUAL = 1,
  TIMING = 2,
  SIGNAL = 3,
}

export enum FillRange {
  WORKSPACE = 1,
  SPECIFY = 2,
  ALL = 3,
}

// 流程类型，起点是申请人节点，一个流程只能有一个
export interface StartNode extends BaseNode {
  type: NodeType.StartNode;
  trigger:
    | {
        type: TriggerType.MANUAL;
      }
    | {
        type: TriggerType.TIMING;
      }
    | {
        type: TriggerType.SIGNAL;
      };
}

export type Flow = AllNode[];
