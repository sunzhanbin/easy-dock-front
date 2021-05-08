export type FieldType = 'Select' | 'Input';

export type BaseField = {
  id: string | undefined;
  version: string;
  title: string;
  desc: string | null;
  required: boolean;
  colSpace: 1 | 2 | 3 | 4 | undefined;
  defaultValue: string | number | undefined | null;
  disabled: boolean;
  editable: boolean;
  readonly: boolean;
  visible: boolean;
  value: string | number | null;
};

export type Schema = {
  [k in FieldType]: {
    key: string;
    label: string;
    type: string;
    direction: 'vertical | horizontal';
  }[];
};

export type AppBindField = {
  type: 'app';
  appId: string;
  fieldId: string;
};

export type CustomField = {
  type: 'custom';
  data: FieldOption[];
};

export type FieldValueSource = CustomField | AppBindField;

export type FieldOption = {
  readonly value: string;
  text: string;
  color?: string;
};

export type FormLogicItem = {
  option: string;
  fields: string[];
};

export type FormLogicType = 'visible' | 'disable' | 'refresh' | 'reset';

export type FormLogicBaseField = {
  [k in FormLogicType]: FormLogicItem[];
};

export type DataFilterCondition = {
  operator: string;
  children: { type: 'field | constant | calc'; value: string | number | DataFilterCondition }[];
};

export type DataBaseField = {
  datasource: FieldValueSource;
  dataFilter: DataFilterCondition[] | null;
};

export type InputBaseField = {
  placeholder: string;
  maxLength: number;
  allowClear: boolean;
  bordered: boolean;
} & BaseField;

export type SingleTextField = {
  type: 'Input';
  prefix?: string;
  suffix?: string;
  reg?: string;
} & InputBaseField;

export type MultipleTextField = { type: 'Input.TextArea'; showCount: boolean } & InputBaseField;

export type SelectBaseField = {
  formLogic: FormLogicBaseField;
} & DataBaseField &
  BaseField;

export type SelectField = {
  type: 'Select';
  mode: 'multipe' | 'tag';
  allowClear: boolean;
  showArrow: boolean;
  showSearch: boolean;
} & SelectBaseField;

export type FormField = SingleTextField | MultipleTextField | SelectField;

export type FormFieldMap = {
  [k: string]: FormField;
};

export type FormDesign = {
  selectedField: string | null;
  byId: FormFieldMap;
  layout: string[][];
  schema: Schema;
};
