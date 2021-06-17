import { AllComponentType } from '@type';

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

export type AllNode = StartNode | AuditNode | FillNode | BranchNode | FinishNode;

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

// 审批节点
export interface UserNode extends BaseNode {
  correlationMemberConfig: {
    members: string[];
  };
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

export enum FlowDetailType {
  MyInitiation = 1,
  MyFinish = 2,
  MyTodo = 3,
}

export enum NodeStatusType {
  Processing = 1,
  Terminated = 2,
  Undo = 3,
  Finish = 4,
  Revert = 5,
}

export enum AuditRecordType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  TURN = 'TURN',
  INSTANCE_STOP = 'INSTANCE_STOP',
  START = 'START',
  FORM_FILL = 'FORM_FILL',
}

type ComponentInfo = AllComponentType & {
  title: string;
};

export interface FormMeta {
  seletedTheme: string;
  components: ComponentInfo[];
  layout: [string, string, string, string][];
  events?: {
    onchange: {
      fieldId: string;
      value: string;
      listeners: {
        visible?: string[];
        reset?: string[];
      };
    }[];
  };
  rules?: {
    type: 'reg' | '<' | '>' | '=' | '||';
    field: string;
    validator?: RegExp | { type: 'ref'; value: string };
    message?: string;
    children?: Omit<NonNullable<FormMeta['rules']>[number], 'children'>[];
  }[];
}

export type FormValue = { [key: string]: any };

export type FieldTemplate = { id: string; name: string };
