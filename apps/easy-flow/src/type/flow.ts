import { fieldRule as FieldRule, FieldType } from './index';
import { DataConfig } from '@type/api';

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
  // 自动节点_数据推送
  AutoNodePushData = 8,
  // 自动节点_触发流程
  AutoNodeTriggerProcess = 9,
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
  [fieldId: string]: AuthType | FieldAuthsMap;
};

export type CorrelationMemberConfigKey = string | number;

export type CorrelationMemberConfig = {
  members: CorrelationMemberConfigKey[];
  depts: CorrelationMemberConfigKey[];
  roles: CorrelationMemberConfigKey[];
  dynamic?: {
    starter?: boolean;
    roles: CorrelationMemberConfigKey[];
    fields: CorrelationMemberConfigKey[];
  };
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
  countersign?: {
    enable: boolean;
    type: 1 | 2;
    count: number;
    percent: number;
  };
}

export interface FillNode extends UserNode {
  type: NodeType.FillNode;
  btnText: {
    submit: ButtonAuth;
    save: ButtonAuth;
  };
}

// 分支节点
export interface SubBranch {
  type: NodeType.SubBranch;
  id: string;
  nodes: AllNode[];
  conditions: FieldRule[][];
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
  fieldsAuths: FieldAuthsMap;
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

export interface AutoNodePushData extends BaseNode {
  type: NodeType.AutoNodePushData;
  dataConfig: DataConfig;
}

export enum StarterEnum {
  FlowStarter = 1, //当前流程发起人
  Admin = 2, //系统发起
}

export interface TriggerConfig {
  processId: number; //自动触发流程id
  processName: string; //自动触发流程名称
  // 发起人
  starter: {
    type: StarterEnum;
    data?: any; //预留字段
  };
  // 字段映射
  mapping: { current: string; target: string }[];
}

export interface AutoNodeTriggerProcess extends BaseNode {
  type: NodeType.AutoNodeTriggerProcess;
  dataConfig: TriggerConfig[];
}

export type AllNode =
  | StartNode
  | AuditNode
  | FillNode
  | BranchNode
  | FinishNode
  | CCNode
  | AutoNodePushData
  | AutoNodeTriggerProcess;

export type Flow = AllNode[];

export type FieldTemplate = { id: string; name: string; type: FieldType; parentId?: string };

export type AddableNode =
  | AuditNode
  | FillNode
  | BranchNode
  | CCNode
  | SubBranch
  | AutoNodePushData
  | AutoNodeTriggerProcess;
