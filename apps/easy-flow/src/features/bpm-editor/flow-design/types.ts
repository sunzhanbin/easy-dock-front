type Member = {
  name: string;
  id: number;
  avatar: string;
};

export enum NodeType {
  // 开始节点
  StartNode = 1,
  // 审批节点
  AuditNode = 2,
  // 填写节点
  FillNode = 3,
  // 抄送节点
  CCNode = 4,
  // 分支节点
  BranchNode = 5,
  // 结束节点
  FinishNode = 6,
}

type CorrelationMemberConfig = {
  // 部门数组
  departs: { id: number; name: string }[];
  // 是否包含子部门
  includeSubDeparts: boolean;
  // 节点成员
  members: Member[];
};

// 节点基本类型
export interface BaseNode {
  id: string;
  type: NodeType;
  name: string;
  correlationMemberConfig: CorrelationMemberConfig;
  // @auth: 0不可见 1仅可见 2可编辑
  fieldsAuths: { id: string; auth: 1 | 2 | 0 }[];
}

export type AllNode = StartNode | AuditNode | FillNode | CCNode | BranchNode | FinishNode;

// 审批节点
export interface AuditNode extends BaseNode {
  type: NodeType.AuditNode;
  rule:
    | {
        // 1常规审批
        type: 1;
        signType: 1 | 2;
      }
    | {
        // 2逐级审批
        type: 2;
      };
  btnText: {
    approve: string | null;
    reject: string | null;
    revert: string | null;
    transfer: string | null;
  };
  transfer: {
    enable: boolean;
    scope: 1 | 2;
    correlationMemberConfig: CorrelationMemberConfig;
  };
  next: Exclude<AllNode, StartNode> | null;
}

// 填写节点
export interface FillNode extends BaseNode {
  type: NodeType.FillNode;
  next: Exclude<AllNode, StartNode> | null;
}

// 抄送节点
export interface CCNode extends BaseNode {
  type: NodeType.CCNode;
  btnText: {
    submit: string | null;
    transfer: string | null;
  };
  next: Exclude<AllNode, StartNode> | null;
}

// 分支类型
interface Branch {
  id: number;
  next: Exclude<AllNode, StartNode>;
}

// 0等于 1不等于 2包含 3不包含
type JudgeType = 0 | 1 | 2 | 3;
type DataType = 0 | 1 | 2;

// 分支节点
export interface BranchNode {
  id: string;
  type: NodeType.BranchNode;
  branches: Branch[];
  conditions: {
    title: string;
    dataType: DataType;
    judgeType: JudgeType;
    values: string[];
    details: [];
  }[];
  next: Exclude<AllNode, StartNode> | null;
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
  fillRange: FillRange;
  trigger: TriggerType;
  btnText: {
    submit: string | null;
  };
  next: Exclude<AllNode, StartNode> | null;
}

export type Flow = StartNode;
