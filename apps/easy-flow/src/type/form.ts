import { ConfigItem } from '.';
import { DataConfig } from './api';

export type FieldType = FormField['type'];

export type BaseField = {
  id: string;
  fieldName: string;
  label: string;
  desc: string;
  colSpace: '1' | '2' | '3' | '4';
  version?: string;
  multiple: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  visible?: boolean;
};

export type InputField = {
  type: 'Input';
  unique: boolean;
  defaultValue: string;
} & BaseField;

export type InputNumberField = {
  type: 'InputNumber';
  defaultValue: number;
  defaultNumber?: {
    customData?: number | undefined;
    calcType?: string | undefined;
    calculateData?: string | string[];
    id: string;
    type: string; // custom | inject
  };
  decimal?: {
    enable: boolean;
    precision?: number;
  };
  numlimit?: {
    enable: boolean;
    numrange?: {
      min: number;
      max: number;
    };
  };
} & BaseField;

export type TextAreaField = {
  type: 'Textarea';
  defaultValue: string;
} & BaseField;

export type DateField = {
  type: 'Date';
  datelimit?: {
    enable?: boolean;
    daterange: {
      min: string;
      max: string;
    };
  };
  format: 'yyyy-MM-DD' | 'yyyy-MM-DD HH:mm:ss';
  defaultValue: number;
} & BaseField;

export type OptionMode = 'custom' | 'subapp' | 'interface';
export type OptionItem = {
  key: string;
  value: string;
};
export type SelectOptionItem = {
  type: OptionMode;
  data?: OptionItem[];
  subappId?: string;
  fieldName?: string;
  apiconfig?: DataConfig;
};

export type NumberDefaultOption = {
  id: string | undefined;
  type: string;
  customData?: number;
  calcType?: string;
  calculateData?: any;
};

export type RadioField = {
  type: 'Radio';
  dataSource: SelectOptionItem;
} & BaseField;

export type CheckboxField = {
  type: 'Checkbox';
  dataSource: SelectOptionItem;
} & BaseField;

export type SelectField = {
  type: 'Select';
  showSearch: boolean;
  dataSource: SelectOptionItem;
} & BaseField;

export type DescTextField = {
  type: 'DescText';
  value: string;
} & BaseField;

export type ImageField = {
  type: 'Image';
  maxNum: number;
} & BaseField;

export type AttachmentField = {
  type: 'Attachment';
  maxNum: number;
} & BaseField;

export type MemberField = {
  type: 'Member';
  showSearch: boolean;
} & BaseField;

export type FlowField = {
  type: 'FlowData';
  flows: any;
} & BaseField;

export type CompConfig = {
  config: ConfigItem;
  props: { [k: string]: any };
};

export type TabsField = {
  type: 'Tabs';
  fieldManage: CompConfig[];
  components?: CompConfig[];
} & BaseField;

export type SerialNumField = {
  type: 'SerialNum';
  serialRule: any;
} & BaseField;

export type FormField =
  | InputField
  | InputNumberField
  | TextAreaField
  | DateField
  | RadioField
  | CheckboxField
  | SelectField
  | DescTextField
  | ImageField
  | AttachmentField
  | MemberField
  | TabsField
  | FlowField
  | SerialNumField;
