export type BaseField = {
  readonly id: string;
  title: string;
  desc?: string;
  required: boolean;
  colSpace?: 1 | 2 | 3 | 4;
};

type AppBindField = {
  type: "app";
  appId: string;
  fieldId: string;
};

type CustomField = {
  type: "custom";
  value: string;
};

export type FieldValueSource = CustomField | AppBindField;

export type SingleTextField = {
  type: "Input";
  placeholder: string;
};

type FormLogicItem = {
  optionId: string;
  fields: string[];
};

export type FormLogic = {
  type: "visible";
  fields: Record<string, FormLogicItem>;
};

export type SelectBaseField = {
  type: "Radio | Select | Checkbox";
  logic: FormLogicItem[];
};
