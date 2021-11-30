import { ConfigItem } from '@type';

export const validateFieldName = (fieldName: string): string => {
  if (!fieldName) {
    return '请填写数据库字段名';
  }
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{0,29}$/;
  if (!reg.test(fieldName)) {
    return '数据库字段名填写错误';
  }
  return '';
};

export const validateLabel = (label: string) => {
  if (!label) {
    return '请填写控件名称';
  }
  return '';
};

export const validateSerial = (config: ConfigItem) => {
  const { type } = config;
  if (
    type === 'SerialNum' &&
    ((!config.serialRule.serialId && !config.serialRule.serialMata.ruleName) ||
      (config.serialRule.serialId && !config.serialRule.serialMata.changeRuleName))
  ) {
    return '请输入规则名称';
  }

  return '';
};

export const validateFields = (components: any) => {
  if (!components || !components?.length) {
    return '请选择子控件';
  }
  return '';
};

export const validateHasChecked = (props: ConfigItem) => {
  const { type } = props;
  switch (type) {
    case 'InputNumber':
      const { decimal, numlimit } = props;
      if (decimal.enable && !decimal.precision) {
        return '请输入小数位数';
      }
      if (numlimit.enable && (!numlimit.numrange || (!numlimit.numrange?.min && !numlimit.numrange?.max))) {
        return '请输入数值范围';
      }
      break;
    case 'Date':
      const { datelimit } = props;
      if (datelimit.enable && (!datelimit.daterange || (!datelimit.daterange?.min && !datelimit.daterange?.max))) {
        return '请输入数值范围';
      }
      break;
    case 'Attachment':
      const { typeRestrict } = props;
      if (typeRestrict.enable && (!typeRestrict.types || !typeRestrict.types.length)) {
        return '请选择文件类型';
      }
      break;
  }
  return '';
};
