import { FormRuleItem, Dept, Role } from './index';
import type { FillNode, AuditNode, StartNode } from './flow';
import { SubApp } from './subapp';

export interface FormMeta {
  seletedTheme: string;
  components: { config: any; props: any }[];
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
  formRules?: FormRuleItem[];
}

export type FormValue = { [key: string]: any };

export enum TaskDetailType {
  MyInitiation = 3,
  MyFinish = 2,
  MyTodo = 1,
}

export type FlowMeta = FillNode | AuditNode | StartNode;

type User = { name: string; id: string; avatar: string };

export enum NodeStatusType {
  Processing = 1,
  Terminated = 2,
  Undo = 3,
  Finish = 4,
  Revert = 5,
}

export type FlowInstance = {
  applyUser: User;
  applyTime: number;
  state: NodeStatusType;
  endTime: number;
  currentNodeId: string;
  currentNodeName: string;
  processInstanceId: string;
  currentProcessor: {
    users?: User[];
    depts?: Dept[];
    roles?: Role[];
  };
  subapp: SubApp;
};

export enum AuditRecordType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  TURN = 'TURN',
  INSTANCE_STOP = 'INSTANCE_STOP',
  START = 'START',
  BACK = 'BACK',
  FORM_FILL = 'FORM_FILL',
  RUNNING = 'RUNNING',
}

export type AuditRecordSchema = {
  auditRecordList: {
    auditTime: number;
    auditType: AuditRecordType;
    comments?: {
      actionName: AuditRecordType;
      commit?: string;
      targetUser?: User;
    };
    nodeName: string;
    taskId: string;
    userList?: User[];
    deptList?: Dept[];
    roleList?: Role[];
  }[];
  taskName: string;
};

export type Datasource = {
  [key: string]: { key: string; value: string }[];
};