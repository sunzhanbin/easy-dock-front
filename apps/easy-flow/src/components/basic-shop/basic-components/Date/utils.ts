import { flowVarsMap } from '@utils';
import moment, { Moment } from 'moment';
import * as math from 'mathjs';

type RuleParams = {
  rules: { [key: string]: any }[];
  formValue: { [key: string]: any };
  current: any;
  id: string;
  range?: { min: string; max: string };
  format?: any;
};

const getFlowVarsRule = (date: string, type: string, format?: string) => {
  switch (date) {
    case 'currentMonth':
      if (type === 'earlier') {
        return moment().startOf('month').valueOf();
      } else {
        return moment().endOf('month').valueOf();
      }
    case 'currentYear':
      if (type === 'earlier') {
        return moment().startOf('year').valueOf();
      } else {
        return moment().endOf('year').valueOf();
      }
    case 'currentTime':
      if (format === 'yyyy-MM-DD HH:mm:ss') {
        return moment().valueOf();
      } else {
        if (type === 'earlier') {
          return moment().startOf('day').valueOf();
        } else {
          return moment().endOf('day').valueOf();
        }
      }
  }
};

const analyseRangeRule = (
  current: Moment,
  currentTime: number,
  compareTimeResult: boolean,
  range: { [key: string]: any },
) => {
  if (range && currentTime && compareTimeResult) {
    // 属性面板日期配置
    let rule1, rule2;
    if (range.min) {
      rule1 = current && current.valueOf() < range.min;
    }
    if (range.max) {
      rule2 = current && current.valueOf() > range.max;
    }
    return rule1 || rule2;
  }
};

// 由于表单静态属性选择日期范围选择多个一样的区间会被覆盖   需要在一组数据中找到该区间的最大最小值
const formatMaxMinDate = (
  rules: { [key: string]: any }[],
  formValue: { [key: string]: any },
  type: string,
  format?: string,
) => {
  const dateRules = rules?.filter((item) => item.condition.symbol === type);
  const ruleWatchKeys = dateRules?.map((rule) => rule.watch).flat(2);
  // 流程变量的数据需要特殊处理
  const flowVarsRule: { [key: string]: any } = {};
  const values: number[] = ruleWatchKeys
    ?.map((item) => {
      if (Object.keys(flowVarsMap).includes(item)) {
        flowVarsRule[item] = getFlowVarsRule(item, type, format) as number;
        return getFlowVarsRule(item, type, format) as number;
      } else {
        return formValue[item] as number;
      }
    })
    ?.filter(Boolean);
  if (values && values.length) {
    let dateValue = '';
    if (type === 'earlier') {
      dateValue = math.min(values);
    } else {
      dateValue = math.max(values);
    }
    const temMap = Object.assign({}, formValue, flowVarsRule);
    const dateKey = Object.keys(temMap).find((fieldKey) => {
      if (Object.keys(flowVarsMap).includes(fieldKey)) {
        return flowVarsRule[fieldKey] === dateValue;
      } else {
        return formValue[fieldKey] === dateValue;
      }
    });
    return rules?.filter((item) => item.watch.includes(dateKey));
  }
  return [];
};

/**
 * 获取当前日期禁用范围
 * @param rules 当前日期规则list
 * @param current 当前日期
 * @param formValue
 * @param id 当前选择的日期字段
 * @param range 属性面板日期范围
 * @param format 属性面板日期显示格式 不带时分秒需要单独处理
 */
const getDisabledDateRule = ({ rules, current, formValue, id, range, format }: RuleParams): boolean => {
  let rules1, rules2, rules3, rules4, rules5, rule6, rule7;
  const earlierRules = formatMaxMinDate(rules, formValue, 'earlier', format);
  const latterRules = formatMaxMinDate(rules, formValue, 'latter', format);
  const formatRules = [...earlierRules, ...latterRules];
  (formatRules ?? []).forEach((item) => {
    const { watch, condition } = item;
    if (condition.symbol === 'earlier') {
      // 早于
      if (Object.keys(flowVarsMap).includes(watch[0])) {
        const currentTime = getFlowVarsRule(watch[0], 'earlier', format)!;
        rules5 = analyseRangeRule(
          current,
          currentTime,
          currentTime > moment(range?.max).valueOf() || currentTime > moment(range?.min).valueOf(),
          range!,
        );
        // 选择流程变量当前时间等
        rules1 = current.valueOf() > currentTime;
      } else {
        // 选择其他控件
        if (id === condition.fieldName) {
          const currentTime = formValue[condition.value as string];
          rules5 = analyseRangeRule(
            current,
            currentTime,
            currentTime > moment(range?.min).valueOf() || currentTime > moment(range?.max).valueOf(),
            range!,
          );
          rules3 = current.valueOf() > currentTime;
        } else if (id === condition.value) {
          const currentTime = formValue[condition.fieldName as string];
          rules5 = analyseRangeRule(
            current,
            currentTime,
            currentTime < moment(range?.max).valueOf() || currentTime < moment(range?.min).valueOf(),
            range!,
          );
          rules3 = current.valueOf() < currentTime;
        }
      }
    }

    if (condition.symbol === 'latter') {
      // 晚于
      if (Object.keys(flowVarsMap).includes(watch[0])) {
        const currentTime = getFlowVarsRule(watch[0], 'latter', format)!;
        rules5 = analyseRangeRule(
          current,
          currentTime,
          currentTime < moment(range?.min).valueOf() || currentTime < moment(range?.max).valueOf(),
          range!,
        );
        // 选择流程变量当前时间等
        rules2 = current.valueOf() < currentTime;
      } else {
        // 选择其他控件
        if (id === condition.fieldName) {
          const currentTime = formValue[condition.value as string];
          rules5 = analyseRangeRule(
            current,
            currentTime,
            currentTime < moment(range?.min).valueOf() || currentTime < moment(range?.max).valueOf(),
            range!,
          );
          rules4 = current.valueOf() < currentTime;
        } else if (id === condition.value) {
          const currentTime = formValue[condition.fieldName as string];
          rules5 = analyseRangeRule(
            current,
            currentTime,
            currentTime > moment(range?.min).valueOf() || currentTime > moment(range?.max).valueOf(),
            range!,
          );
          rules4 = current.valueOf() > currentTime;
        }
      }
    }
  });

  if (!rules && range) {
    if (range.min) {
      rule6 = current && current < moment(range.min);
    }
    if (range.max) {
      rule7 = current && current > moment(range.max);
    }
    // rules5 =
    //   (range.min && current.valueOf() < moment(range.min).valueOf()) ||
    //   (range.max && current.valueOf() > moment(range.max).valueOf());
  }
  // @ts-ignore
  return rules1 || rules2 || rules3 || rules4 || rules5 || rule6 || rule7;
};

export default getDisabledDateRule;
