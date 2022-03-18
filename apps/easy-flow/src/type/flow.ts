import { fieldRule as FieldRule, FieldType } from "./index";
import { DataConfig, MethodType } from "@type/api";

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
  // 自动节点_数据连接
  AutoNodePushData = 8,
  // 自动节点_触发流程
  AutoNodeTriggerProcess = 9,
  // 插件节点
  PluginNode = 10,
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

export type MilestonePercentType = {
  enable: boolean;
  percent: number;
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

export interface FieldAuth {
  type: string;
  field: string;
  name: string;
  auth: AuthType | null;
  components: FieldAuth[] | null;
}

export enum TimeUnit {
  Day = "day",
  Hour = "hour",
  Minute = "minute",
}

export interface IDueConfig {
  enable: boolean;
  timeout: {
    num?: number;
    unit: TimeUnit;
  };
  cycle: {
    enable: boolean;
    num?: number;
    unit: TimeUnit;
  };
  notice: {
    starter: boolean;
    assign: boolean;
    admin: boolean;
    other: boolean;
    users?: number[];
  };
  action?: "submit" | "back" | null;
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
  progress?: MilestonePercentType;
  dueConfig: IDueConfig;
}

export interface FillNode extends UserNode {
  type: NodeType.FillNode;
  dueConfig?: IDueConfig;
  progress?: MilestonePercentType;
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
  progress?: MilestonePercentType;
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
  progress?: MilestonePercentType;
  fieldsAuths: FieldAuthsMap;
}

export interface AutoNodePushData extends BaseNode {
  type: NodeType.AutoNodePushData;
  progress?: MilestonePercentType;
  dataConfig: DataConfig;
  nextAction: NextAction;
}

export interface PluginHttpParam {
  name: string;
  key: string;
  map?: string;
  required?: boolean;
}
export interface PluginMeta {
  url: string;
  method: MethodType;
  paths: PluginHttpParam[];
  headers: PluginHttpParam[];
  querys: PluginHttpParam[];
  bodys: PluginHttpParam[];
  responses: PluginHttpParam[];
}

export enum NextActionType {
  Continue = 1, //无条件流转到下个节点
  Condition = 2, //依据条件判断是否继续流转
}

export enum FailAction {
  Finish = 1, //失败后结束流程
  Revert = 2, //失败后驳回到指定节点
}

export interface ConditionItem {
  params?: string;
  type?: string;
  symbol?: string;
  value?: string;
}

export interface NextAction {
  type: NextActionType;
  conditions: ConditionItem[][];
  failConfig: {
    type: FailAction;
    revert: {
      type: RevertType;
      nodeId?: string;
    };
  };
}

export interface PluginDataConfig {
  type: string; //暂时只支持http类型
  code: string;
  name: string;
  meta: PluginMeta;
}

export interface PluginNode extends BaseNode {
  type: NodeType.PluginNode;
  dataConfig: PluginDataConfig;
  nextAction: NextAction;
  progress?: MilestonePercentType;
}

export enum StarterEnum {
  FlowStarter = 1, //当前流程发起人
  Admin = 2, //系统发起
  FormComponent = 3, //表单中人员控件的值
}

export interface TriggerConfig {
  id: number | undefined; //自动触发流程id
  name: string | undefined; //自动触发流程名称
  // 发起人
  starter: {
    type: StarterEnum;
    value?: string; //表单中人员控件的值
  };
  // 字段映射
  mapping: { current: string; target: string; required?: boolean }[];
}

export interface AutoNodeTriggerProcess extends BaseNode {
  type: NodeType.AutoNodeTriggerProcess;
  progress?: MilestonePercentType;
  triggerConfig: {
    isWait: boolean;
    subapps: TriggerConfig[];
  };
}

export type AllNode =
  | StartNode
  | AuditNode
  | FillNode
  | BranchNode
  | FinishNode
  | CCNode
  | PluginNode
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
  | PluginNode
  | AutoNodePushData
  | AutoNodeTriggerProcess;

export interface PluginItem {
  code: string;
  enabled: boolean;
  group: {
    id: number;
    name: string;
  };
  icon: string;
  id: number;
  name: string;
  type: string;
}

export interface PluginGroupItem {
  id: number;
  name: string;
  plugins: Array<{ code: string; enabled: boolean; id: number; name: string }>;
}
