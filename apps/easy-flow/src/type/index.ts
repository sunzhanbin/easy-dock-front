import { Rule } from 'antd/lib/form';
import { String } from 'lodash';

export type FieldType = 'Select' | 'Input' | 'Textarea' | 'Radio' | 'Checkbox' | 'Date' | 'InputNumber' | 'DescText';

export type BaseField = {
  id: string | undefined;
  version: string;
  fieldName: string;
  label: string;
  desc: string;
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
  required?: boolean;
  requiredMessage?: string;
  rules?: Rule[];
  children?: SchemaConfigItem;
  direction?: 'vertical' | 'horizontal';
  range?: rangeItem[];
  isProps: boolean;
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
  name: string;
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

export type SelectField = {
  type: 'Select';
  allowClear: boolean;
  showArrow: boolean;
  showSearch: boolean;
  multiple: boolean;
  selectOptionList: SelectOptionItem;
} & SelectBaseField;

export type DateField = {
  type: 'Date';
  format: string;
  notSelectPassed: boolean;
} & BaseField;

export type RadioField = {
  type: 'Radio';
  optionList: SelectOptionItem;
} & BaseField;

export type CheckboxField = {
  type: 'Checkbox';
  optionList: SelectOptionItem;
} & BaseField;

export type FormField = SingleTextField | MultipleTextField | SelectField | DateField | RadioField | CheckboxField;

export type FormFieldMap = {
  [k: string]: FormField;
};
export type ErrorItem = {
  id: string;
  content: string;
};

export type filedRule = {
  field: string;
  symbol: string;
  value?: string | number | string[] | [number, number];
};
// 值改变时规则
export type FormChangeRule = {
  filedRule: filedRule[][];
  showComponents: string[];
  hideComponents: string[];
};
// 进入表单时规则
export type FormInitRule = {
  interfaceName: string;
  interfaceUrl: string;
  requestParams: { position: string; name: string; componentName: string }[];
  responseParams: { name: string; componentName: string }[];
};

export type FormRuleItem = {
  type: 'change' | 'init';
  formChangeRule?: FormChangeRule;
  formInitRule?: FormInitRule;
};

export type FormDesign = {
  formId?: string;
  selectedField: string | null;
  byId: FormFieldMap;
  layout: string[][];
  errors: ErrorItem[];
  formRules: FormRuleItem[];
  schema: Schema;
  isDirty: boolean;
  subAppInfo: {
    name: string;
    id: number | string;
    appId: number | string;
  };
};

export type TConfigItem = {
  [k: string]: string | number | boolean | undefined | null;
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

export type AllComponentType = SingleTextField | SelectField | DateField | RadioField | CheckboxField;

export type ConfigItem = { [k: string]: string | number | boolean | null | undefined | Object | Array<any> };
export type ComponentConfig = {
  config: ConfigItem;
  props: ConfigItem;
};
export type Event = {
  fieldId: string;
  value: string | number | boolean | string[];
  listeners: {
    visible: string[];
    reset: string[];
  };
};
export type Events = {
  onChange: Event[];
};
export type FormRule = {
  type: string;
  field: string;
};
export type Theme = {
  name: string;
};
export type FormMeta = {
  selectedTheme?: string;
  components: ComponentConfig[];
  layout: string[][];
  events?: Events;
  schema: { [k: string]: SchemaItem };
  rules?: FormRule[];
  themes?: Theme[];
};

export type Datasource = {
  [key: string]: { key: string; value: string }[];
};
