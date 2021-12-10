import { nameRegexp } from '@/utils';
import { ConfigItem, FormRuleItem, UrlOptionItem } from '@type';
import { message } from 'antd';
import { dataPushConfig } from '../flow-design/validators';
// import { current } from '@reduxjs/toolkit';

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
  if (!nameRegexp.test(label.trim())) {
    return '请输入1-30位的汉字、字母、数字、下划线';
  }
  return '';
};

export const validateSerial = (config: ConfigItem) => {
  const { type } = config;
  if (type !== 'SerialNum') return '';
  // 自定义规则和已有规则规则名称两个必须输入一个
  if (
    (!config.serialRule.serialId && !config.serialRule.serialMata.ruleName) ||
    (config.serialRule.serialId && !config.serialRule.serialMata.changeRuleName)
  ) {
    return 'SerialError';
  }
  if (!config.serialRule.serialId) {
    message.error('编号控件未关联编号规则，请检查!');
    return 'errorTipsExchange';
  }
  const name = config.serialRule.serialMata?.ruleName;
  const changeName = config.serialRule.serialMata?.changeRuleName;
  // 自定义规则和已有规则规则名称不符合格式
  if (
    (name && !/^[\u4E00-\u9FA5a-zA-Z0-9_]{1,30}$/.test(name)) ||
    (changeName && !/^[\u4E00-\u9FA5a-zA-Z0-9_]{1,30}$/.test(changeName))
  ) {
    return 'SerialError';
  }
  return '';
};

export const validateSerialCustom = (config: ConfigItem) => {
  const { type } = config;
  if (type !== 'SerialNum') return '';
  const { serialMata } = config.serialRule;
  const hasChars = serialMata.rules?.some(
    (item: { type: string; chars?: string }) => item.type === 'fixedChars' && !item.chars,
  );
  if (hasChars) {
    return '请输入自定义规则固定字符';
  }
  return '';
};

export const validateSerialInject = (config: ConfigItem) => {
  const { type } = config;
  if (type !== 'SerialNum') return '';
  const { serialMata } = config.serialRule;

  const hasChangeChars = serialMata?.changeRules?.some(
    (item: { type: string; chars?: string }) => item.type === 'fixedChars' && !item.chars,
  );
  if (hasChangeChars) {
    return '请输入已有规则固定字符';
  }
  return '';
};

export const validateFields = (components: any) => {
  if (!components || !components?.length) {
    return '请选择子控件';
  }
  return '';
};

export const validateHasChecked = (props: ConfigItem, config: ConfigItem) => {
  const { type } = props;
  switch (type) {
    case 'InputNumber':
      const { decimal = {}, numlimit = {} } = props;
      const defaultNumber = config.defaultNumber || props.defaultNumber;
      if (decimal.enable && !decimal.precision) {
        return '请输入小数位数';
      }
      if (decimal.enable && !/^[1-9]\d*$/.test(decimal.precision)) {
        return '请输入正整数';
      }
      if (numlimit.enable && (!numlimit.numrange || (!numlimit.numrange?.min && !numlimit.numrange?.max))) {
        return '请输入数值范围';
      }

      if (numlimit.enable) {
        if (typeof defaultNumber === 'object' && defaultNumber) {
          if (
            defaultNumber.customData &&
            defaultNumber.type === 'custom' &&
            (defaultNumber.customData < numlimit.numrange?.min || defaultNumber.customData > numlimit.numrange?.max)
          ) {
            message.error('该默认值已超过限制范围，请重新输入！');
            return 'errorTipsExchange';
          }
        } else if (typeof defaultNumber === 'number') {
          // 兼容tab里的数字控件
          if (defaultNumber < numlimit.numrange?.min || defaultNumber > numlimit.numrange?.max) {
            message.error('该默认值已超过限制范围，请重新输入！');
            return 'errorTipsExchange';
          }
        }
      }
      break;
    case 'Date':
      const { datelimit = {}, defaultValue = {} } = props;
      if (datelimit.enable && (!datelimit.daterange || (!datelimit.daterange?.min && !datelimit.daterange?.max))) {
        return '请输入数值范围';
      }
      if (
        datelimit.enable &&
        defaultValue &&
        (defaultValue < datelimit.daterange?.min || defaultValue > datelimit.daterange?.max)
      ) {
        message.error('该默认值已超过限制范围，请重新输入！');
        return 'errorTipsExchange';
      }
      break;
    case 'Attachment':
      const { typeRestrict = {} } = props;
      if (typeRestrict.enable && (!typeRestrict.types || !typeRestrict.types.length)) {
        return '请选择文件类型';
      }
      if (
        typeRestrict.enable &&
        typeRestrict.types &&
        typeRestrict.types.length &&
        typeRestrict.types.includes('custom') &&
        (!typeRestrict.custom || !typeRestrict.custom.length)
      ) {
        return '请选择自定义文件类型';
      }
      break;
  }
  return '';
};

// 表单属性关联的该控件规则也需要清空
export const formatRules = (rules: FormRuleItem[], id: string) => {
  rules?.forEach((rule) => {
    if (!rule.formChangeRule) return;
    const { formChangeRule } = rule;
    const { fieldRule, showComponents, hideComponents } = formChangeRule;
    rule.formChangeRule.fieldRule = fieldRule
      .map((field) => field.filter((item) => item.fieldName !== id && item.value !== id))
      .filter((item) => item.length);
    if (showComponents || hideComponents) {
      rule.formChangeRule.showComponents = showComponents?.filter((item) => !item?.includes(id));
      rule.formChangeRule.hideComponents = hideComponents?.filter((item) => !item?.includes(id));
    }
  });
  return rules;
};

export const formatSerialRules = (byId: any, id: string) => {
  const componentList = Object.values(byId).map((item: any) => item) || [];
  componentList.forEach((comp) => {
    if (comp.type === 'SerialNum') {
      const { serialMata = {} } = comp.serialRule;
      serialMata.changeRules = serialMata.changeRules.filter((item: any) => {
        if (item.type === 'fieldName') {
          return item.fieldValue !== id && item;
        }
        return item;
      });
      serialMata.rules = serialMata.rules.filter((item: any) => {
        if (item.type === 'fieldName') {
          return item.fieldValue !== id && item;
        }
        return item;
      });
    }
  });
  return byId;
};

// eslint-disable-next-line
export const urlRegex = /(^(http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/;

export const validUrlOption = (option: UrlOptionItem) => {
  if (option.type === 'custom') {
    if (!option?.customValue) {
      return '请输入url';
    }
    if (!urlRegex.test(option?.customValue)) {
      return '请输入正确的url';
    }
    return '';
  } else if (option.type === 'interface') {
    return dataPushConfig(option.apiConfig!);
  }
  return '';
};
