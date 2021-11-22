import { RuleOption } from '@type';

// 编号规则日期定义
export const DATE_DEFAULT_FORMAT = 'yyyyMMdd';

export const DateOptions = [
  { key: 'yyyy', value: '年' },
  { key: 'yyyyMM', value: '年月' },
  { key: 'yyyyMMdd', value: '年月日' },
];

// 编号规则自动计数定义
export const ResetDurationOptions = [
  { key: 'none', value: '不自动重置' },
  { key: 'day', value: '每日重置' },
  { key: 'week', value: '每周重置' },
  { key: 'month', value: '每月重置' },
  { key: 'year', value: '每年重置' },
];

export const initialRules: RuleOption[] = [
  {
    digitsNum: 5,
    startValue: 1,
    resetDuration: 'none',
    type: 'incNumber',
  },
];

// 属性面板panel定义label是否带checkbox
export const LABEL_INCLUDE_CHECKBOX = ['allowDecimal', 'limitNum', 'limitDate', 'files'];

export const LABEL_LINKED_RULES = ['precision', 'limit', 'daterange', 'filetype'];
