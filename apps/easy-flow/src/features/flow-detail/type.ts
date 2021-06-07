import { Depart } from '@type';
import { FillNode, AuditNode, NodeStatusType, FormMeta, FormValue, AuditRecordType } from '@type/flow';

export type { SelectField, SingleTextField } from '@type';

export type FlowDetaiDataType = {
  auditRecords: {
    auditTime: string;
    auditType: AuditRecordType;
    comments?: string;
    nodeName: string;
    userName: string;
    userAvatar?: string;
  }[];
  detail: {
    applyUser: string;
    applyTime: string;
    state: NodeStatusType;
    timeUsed: string;
    currentProcessor: {
      groups: Depart[];
      users: { name: string; id: string; avatar: string }[];
    };
  };
  formMeta: FormMeta;
  formData: FormValue;
  processMeta: FillNode | AuditNode;
};
