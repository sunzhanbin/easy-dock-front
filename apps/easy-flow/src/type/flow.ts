export enum NodeType {
  // 开始节点
  StartNode = 1,
  // 审批节点
  AuditNode = 2,
  // 填写节点
  FillNode = 3,
  // 分支节点
  BranchNode = 4,
  // 结束节点
  FinishNode = 5,
  // 抄送节点
  CCNode = 6,
  // 分支
  SubBranch = 7,
}

export enum AuthType {
  Denied = 0,
  View = 1,
  Edit = 2,
  Required = 3,
}
// 节点基本类型
export interface BaseNode {
  id: string;
  type: NodeType;
  name: string;
}

export type ButtonAuth = {
  enable?: boolean;
  text?: string;
};

export enum RevertType {
  Start = 1,
  Prev = 2,
  Specify = 3,
}

export type FieldAuthsMap = {
  [fieldId: string]: AuthType;
};

export type CorrelationMemberConfig = {
  members: string[];
};
// 审批节点
export interface UserNode extends BaseNode {
  correlationMemberConfig: CorrelationMemberConfig;
  fieldsAuths: FieldAuthsMap;
}

export interface AuditNode extends UserNode {
  type: NodeType.AuditNode;
  btnText: {
    approve: ButtonAuth;
    revert: ButtonAuth;
    save: ButtonAuth;
    transfer?: ButtonAuth;
    terminate?: ButtonAuth;
  };
  revert: {
    type: RevertType;
    nodeId?: string;
  };
}

export interface FillNode extends UserNode {
  type: NodeType.FillNode;
  btnText: {
    submit: ButtonAuth;
    save: ButtonAuth;
  };
}

// 0等于 1不等于 2包含 3不包含
type JudgeType = 0 | 1 | 2 | 3;
type DataType = 0 | 1 | 2;

type BranchCondition = {
  dataType: DataType;
  judgeType: JudgeType;
  value: string;
};
// 分支节点

export interface SubBranch {
  type: NodeType.SubBranch;
  id: string;
  nodes: AllNode[];
  conditions: BranchCondition[];
}
export interface BranchNode {
  id: string;
  type: NodeType.BranchNode;
  branches: SubBranch[];
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

export type TimingTrigger = {
  type: TriggerType.TIMING;
  startTime: number;
  cycleRange: [number | null, number | null];
  frequency: {
    value: number;
    unit: string;
  };
};
// 流程类型，起点是申请人节点，一个流程只能有一个
export interface StartNode extends BaseNode {
  type: NodeType.StartNode;
  trigger:
    | {
        type: TriggerType.MANUAL;
      }
    | TimingTrigger
    | {
        type: TriggerType.SIGNAL;
        match: string;
      };
}

export interface CCNode extends BaseNode {
  type: NodeType.CCNode;
  correlationMemberConfig: CorrelationMemberConfig;
  fieldsAuths: FieldAuthsMap;
}

export type AllNode = StartNode | AuditNode | FillNode | BranchNode | FinishNode | CCNode;

export type Flow = AllNode[];

export type FieldTemplate = { id: string; name: string };

export type AddableNode = AuditNode | FillNode | BranchNode | CCNode | BranchNode | SubBranch;
