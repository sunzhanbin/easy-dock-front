import { SelectField, SingleTextField, Depart, User } from '@type';
import { FillNode, AuditNode, NodeStatusType } from '@type/flow';

export type { SelectField, SingleTextField } from '@type';

type ComponentInfo = (SelectField | SingleTextField) & {
  title: string;
};

export interface FormMeta {
  seletedTheme: string;
  components: ComponentInfo[];
  layout: [string, string, string, string][];
  events: {
    onchange: {
      fieldId: string;
      value: string;
      listeners: {
        visible?: string[];
        reset?: string[];
      };
    }[];
  };
  rules: {
    type: 'reg' | '<' | '>' | '=' | '||';
    field: string;
    validator?: RegExp | { type: 'ref'; value: string };
    message?: string;
    children?: Omit<FormMeta['rules'][number], 'children'>[];
  }[];
}

export type FormValue = { [key: string]: any };

export type FlowDetaiDataType = {
  auditRecords: [];
  detail: {
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
