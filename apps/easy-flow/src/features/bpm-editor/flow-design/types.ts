type Member = {
  name: string;
  id: number;
  avatar: string;
};

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

type CorrelationMemberConfig = {
  // 部门数组
  departs: { id: number; name: string }[];
  // 是否包含子部门
  includeSubDeparts: boolean;
  // 节点成员
  members: Member[];
};

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
  enable: boolean;
  text: string;
};
// 审批节点
export interface UserNode extends BaseNode {
  type: NodeType.UserNode;
  btnText?: {
    approve?: ButtonAuth;
    reject?: ButtonAuth;
    revert?: ButtonAuth;
    submit?: ButtonAuth;
  };
  correlationMemberConfig: CorrelationMemberConfig;
  fieldsAuths: FieldAuth[];
  revert?: {
    nodeId: string;
  };
  signRule?: {
    tpye: 1 | 2;
    config: {};
  };
}

// 分支类型
interface Branch {
  id: number;
  next: Exclude<AllNode, StartNode>;
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
  branches: { nodes: AllNode[]; conditions: BranchCondition[] }[];
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

export type Flow = [StartNode, ...(UserNode | BranchNode)[], FinishNode];
