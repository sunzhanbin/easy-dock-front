import { Rule } from 'antd/lib/form';
import { DataConfig } from './api';
import { FormField, FieldType } from './form';
export * from './form';

export type { Member, Dept, Role } from '@common/type';

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
  max?: number;
  min?: number;
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
  apiConfig?: DataConfig;
};

export type FormFieldMap = {
  [k: string]: FormField;
};
export type ErrorItem = {
  id: string;
  content: string;
};

export type fieldRule = {
  fieldName: string | undefined;
  symbol?: string;
  fieldType?: string;
  value?: string | number | string[] | [number, number];
};
// 值改变时规则
export type FormChangeRule = {
  fieldRule: fieldRule[][];
  showComponents: string[];
  hideComponents: string[];
};

export type FormRuleItem = {
  type: 'change' | 'init';
  formChangeRule?: FormChangeRule;
  formInitRule?: DataConfig;
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
  [k: string]: any;
};

export type TConfigMap = {
  [k: string]: TConfigItem;
};

type MoveDirection = 'up' | 'down' | 'left' | 'right';

export type MoveConfig = {
  [k in MoveDirection]: boolean;
};

export type MemberConfig = {
  // 部门数组
  depts: number[];
  // 是否包含子部门
  includeSubdepts: boolean;
  // 节点成员
  members: string[];
};

export type AllComponentType = FormField;

export type ConfigItem = {
  [k: string]: any;
  type: FieldType;
  label?: string;
  id: string;
};
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
  formRules: FormRuleItem[];
  rules?: FormRule[];
  themes?: Theme[];
};

export type Datasource = {
  [key: string]: { key: string; value: string }[];
};
