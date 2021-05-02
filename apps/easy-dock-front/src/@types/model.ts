type BaseField = {
  readonly id: string;
  title: string;
  desc?: string;
  required: boolean;
  colSpace?: 1 | 2 | 3 | 4;
  value: any;
};

type AppBindField = {
  type: "app";
  appId: string;
  fieldId: string;
};

type CustomField = {
  type: "custom";
  data: string;
};

type FieldValueSource = CustomField | AppBindField;

export type SingleTextField = {
  type: "Input";
  placeholder: string;
};

type FormLogicItem = {
  optionId: string;
  fields: string[];
};

type FormLogic = {
  type: "visible";
  fields: Record<string, FormLogicItem>;
};

export type SelectBaseField = {
  type: "Radio | Select | Checkbox";
  logic: FormLogic[];
} & DataBaseField &
  BaseField;

type DataBaseField = {
  datasource: FieldValueSource;
};
