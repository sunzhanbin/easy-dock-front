import { flowVarsMap } from '@utils';
import moment from 'moment';

type RuleParams = {
  rules: { [key: string]: any }[];
  formValue: { [key: string]: any };
  current: any;
  id: string;
};

const getFlowVarsRule = (date: string) => {
  switch (date) {
    case 'currentMonth':
      return moment().startOf('month').valueOf();
    case 'currentYear':
      return moment().startOf('year').valueOf();
    case 'currentTime':
      return moment().valueOf();
  }
};

/**
 * 获取当前日期禁用范围
 * @param rules 当前日期规则list
 * @param current 当前日期
 * @param formValue
 * @param id 当前选择的日期字段
 */
const getDisabledDateRule = ({ rules, current, formValue, id }: RuleParams): boolean => {
  let rules1, rules2, rules3, rules4, rules5, rules6;
  (rules ?? []).forEach((item) => {
    const { watch, condition } = item;
    if (condition.symbol === 'earlier') {
      if (Object.keys(flowVarsMap).includes(watch[0])) {
        // 选择流程变量
        rules1 = current.valueOf() > getFlowVarsRule(watch[0])!;
      } else {
        // 选择其他控件
        if (id === condition.fieldName) {
          rules3 = current.valueOf() > formValue[condition.value as string];
        }

        if (id === condition.value) {
          rules5 = current.valueOf() < formValue[condition.fieldName as string];
        }
      }
    }

    if (condition.symbol === 'latter') {
      if (Object.keys(flowVarsMap).includes(watch[0])) {
        // 选择流程变量
        rules2 = current.valueOf() < getFlowVarsRule(watch[0])!;
      } else {
        // 选择其他控件
        if (id === condition.fieldName) {
          rules4 = current.valueOf() < formValue[condition.value as string];
        }
        if (id === condition.value) {
          rules6 = current.valueOf() > formValue[condition.fieldName as string];
        }
      }
    }
  });
  // @ts-ignore
  return rules1 || rules2 || rules4 || rules3 || rules5 || rules6;
};

export default getDisabledDateRule;
