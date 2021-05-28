import { FormInstance } from 'antd';

export type FieldType = 'Select' | 'Input';

export type BaseField = {
  id: string | undefined;
  version: string;
  fieldName: string;
  label: string;
  tip: string | null;
  required?: boolean;
  colSpace: 1 | 2 | 3 | 4 | undefined;
  defaultValue: string | number | undefined;
  disabled?: boolean;
  readonly?: boolean;
  visible?: boolean;
  value: string | number | null;
};

export type SchemaConfigItem = {
  key: string;
  label?: string;
  type: string;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  children?: SchemaConfigItem;
  direction?: 'vertical' | 'horizontal';
  range?: rangeItem[];
};

export type rangeItem = {
  key: string;
  value: string | number | boolean;
};

export type SchemaItem = {
  baseInfo: {
    version: string;
    type: FieldType;
    name: string;
    icon: string;
    category: string;
  };
  config: SchemaConfigItem[];
};

export type Schema = {
  [k in FieldType]?: SchemaItem;
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
  dataFilter?: DataFilterCondition[] | null;
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
  multiple: boolean;
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

export type TConfigItem = {
  [k: string]: string | number | boolean | undefined | null | FormInstance;
};

export type TConfigMap = {
  [k: string]: TConfigItem;
};

type MoveDirection = 'up' | 'down' | 'left' | 'right';

export type MoveConfig = {
  [k in MoveDirection]: boolean;
};

export type Member = {
  name: string;
  loginName: string;
  avatar: string;
};

export type MemberConfig = {
  // 部门数组
  departs: number[];
  // 是否包含子部门
  includeSubDeparts: boolean;
  // 节点成员
  members: string[];
};

export type User = {
  name: string;
  loginName: string;
  avatar: string;
};

export type Depart = {
  name: string;
  id: number;
  avatar: string;
};
