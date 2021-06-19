import { Depart } from '@type';
import { FillNode, AuditNode, NodeStatusType, FormMeta, FormValue, AuditRecordType } from '@type/flow';

export type { SelectField, SingleTextField } from '@type';

type User = { name: string; id: string; avatar: string };

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
    userList: User[];
  }[];
  taskName: string;
};

export type FlowDetaiDataType = {
  auditRecords: AuditRecordSchema;
  detail: {
    applyUser: string;
    applyTime: number;
    state: NodeStatusType;
    endTime: number;
    currentNodeId: string;
    currentProcessor: {
      groups: Depart[];
      users: { name: string; id: string; avatar: string }[];
    };
  };
  formMeta: FormMeta;
  formData: FormValue;
  processMeta: FillNode | AuditNode;
};

export enum TaskDetailType {
  MyInitiation = 3,
  MyFinish = 2,
  MyTodo = 1,
}

export type DetailData = {
  task: {
    id: string;
    state: TaskDetailType;
  };
  flow: {
    node: FillNode | AuditNode;
    instance: {
      applyUser: User;
      applyTime: number;
      state: NodeStatusType;
      endTime: number;
      currentNodeId: string;
      processInstanceId: string;
      currentProcessor: {
        groups: Depart[];
        users: User[];
      };
      subApp: {
        name: string;
        version: {
          id: number;
        };
        id: number;
      };
    };
  };
  form: {
    meta: FormMeta;
    value: FormValue;
  };
};
