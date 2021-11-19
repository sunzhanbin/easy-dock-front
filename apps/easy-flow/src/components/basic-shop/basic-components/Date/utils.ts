import { flowVarsMap } from '@utils';
import moment, { Moment } from 'moment';

type RuleParams = {
  rules: { [key: string]: any }[];
  formValue: { [key: string]: any };
  current: any;
  id: string;
  range?: { min: string; max: string };
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

const analyseRangeRule = (
  current: Moment,
  currentTime: number,
  compareTimeResult: boolean,
  range: { [key: string]: any },
) => {
  if (range && (!currentTime || compareTimeResult)) {
    // 属性面板日期配置
    return (current && current < moment(range.min)) || (current && current > moment(range.max));
  }
};

/**
 * 获取当前日期禁用范围
 * @param rules 当前日期规则list
 * @param current 当前日期
 * @param formValue
 * @param id 当前选择的日期字段
 * @param range 属性面板日期范围
 */
const getDisabledDateRule = ({ rules, current, formValue, id, range }: RuleParams): boolean => {
  let rules1, rules2, rules3, rules4, rules5;
  (rules ?? []).forEach((item) => {
    const { watch, condition } = item;
    if (condition.symbol === 'earlier') {
      if (Object.keys(flowVarsMap).includes(watch[0])) {
        const currentTime = getFlowVarsRule(watch[0])!;
        rules5 = analyseRangeRule(current, currentTime, currentTime > moment(range?.min).valueOf(), range!);
        // 选择流程变量当前时间等
        rules1 = current.valueOf() > currentTime;
      } else {
        // 选择其他控件
        if (id === condition.fieldName) {
          const currentTime = formValue[condition.value as string];
          rules5 = analyseRangeRule(current, currentTime, currentTime > moment(range?.min).valueOf(), range!);
          rules3 = current.valueOf() > currentTime;
        } else if (id === condition.value) {
          const currentTime = formValue[condition.fieldName as string];
          rules5 = analyseRangeRule(current, currentTime, currentTime < moment(range?.max).valueOf(), range!);
          rules3 = current.valueOf() < currentTime;
        }
      }
    }

    if (condition.symbol === 'latter') {
      if (Object.keys(flowVarsMap).includes(watch[0])) {
        const currentTime = getFlowVarsRule(watch[0])!;
        rules5 = analyseRangeRule(current, currentTime, currentTime < moment(range?.max).valueOf(), range!);
        // 选择流程变量当前时间等
        rules2 = current.valueOf() < currentTime;
      } else {
        // 选择其他控件
        if (id === condition.fieldName) {
          const currentTime = formValue[condition.value as string];
          rules5 = analyseRangeRule(current, currentTime, currentTime < moment(range?.min).valueOf(), range!);
          rules4 = current.valueOf() < currentTime;
        } else if (id === condition.value) {
          const currentTime = formValue[condition.fieldName as string];
          rules5 = analyseRangeRule(current, currentTime, currentTime > moment(range?.min).valueOf(), range!);
          rules4 = current.valueOf() > currentTime;
        }
      }
    }
  });

  if (!rules && range) {
    rules5 = current.valueOf() < moment(range.min).valueOf() || current.valueOf() > moment(range.max).valueOf();
  }
  // @ts-ignore
  return rules1 || rules2 || rules3 || rules4 || rules5;
};

export default getDisabledDateRule;
