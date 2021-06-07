import { SelectField, SingleTextField, Depart } from '@type';
import { FillNode, AuditNode, NodeStatusType, FormMeta, FormValue } from '@type/flow';

export type { SelectField, SingleTextField } from '@type';

export type FlowDetaiDataType = {
  auditRecords: [];
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
