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
  range?: [number, number];
} & BaseField;

export type TextAreaField = {
  type: 'Textarea';
  defaultValue: string;
} & BaseField;

export type DateField = {
  type: 'Date';
  notSelectPassed: boolean;
  format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss';
  defaultValue: number;
} & BaseField;

export type OptionMode = 'custom' | 'subapp';
export type OptionItem = {
  key: string;
  value: string;
};
export type SelectOptionItem = {
  type: OptionMode;
  data?: OptionItem[];
  subappId?: string;
  fieldName?: string;
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
  | AttachmentField;
