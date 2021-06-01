import { SelectField, SingleTextField } from '@type';

export type { SelectField, SingleTextField } from '@type';

export interface FormInfo {
  seletedTheme: string;
  components: (SelectField | SingleTextField)[];
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
    children?: Omit<FormInfo['rules'][number], 'children'>[];
  }[];
}

export interface Task {
  formDesign: FormInfo;
}
