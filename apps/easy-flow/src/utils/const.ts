import { RuleOption } from "@type";
import useMemoCallback from "@common/hooks/use-memo-callback";

// 编号规则日期定义
export const DATE_DEFAULT_FORMAT = "yyyyMMdd";

export const DateOptions = [
  { key: "yyyy", value: "年" },
  { key: "yyyyMM", value: "年.月" },
  { key: "yyyyMMdd", value: "年.月.日" },
];

// 编号规则自动计数定义
export const ResetDurationOptions = [
  { key: "none", value: "不自动重置" },
  { key: "day", value: "每日重置" },
  { key: "week", value: "每周重置" },
  { key: "month", value: "每月重置" },
  { key: "year", value: "每年重置" },
];

export const SERIAL_TYPE = {
  CUSTOM_TYPE: "custom",
  INJECT_TYPE: "inject",
};

export const initialRules: RuleOption[] = [
  {
    digitsNum: 5,
    startValue: 1,
    resetDuration: "none",
    type: "incNumber",
  },
];

export const RULE_TYPE = ["incNumber", "createTime", "fixedChars", "fieldName"];

export const INCREASE_NUM_LIST: { [key: string]: any } = {
  none: "仅当计数达到最大值时，从初始值开始重新计数",
  day: "每日重置：每日00:00:00，自动从初始值重新开始计数。一天内如果计数达到最大值，从初始值开始重新计数",
  week: "每周重置：每周一00:00:00，自动从初始值重新开始计数。一周内如果计数达到最大值，从初始值开始重新计数",
  month:
    "每月重置：每月首日00:00:00，自动从初始值重新开始计数。一月内如果计数达到最大值，从初始值开始重新计数计数达到最大值，从初始值开始重新计数",
  year: "每年重置：每年首日00:00:00，自动从初始值重新开始计数。一年内如果计数达到最大值，从初始值开始重新计数",
};

// 属性面板panel定义label是否带checkbox
export const LABEL_INCLUDE_CHECKBOX = ["allowDecimal", "limitNum", "limitDate", "files"];

export const LABEL_LINKED_RULES = ["precision", "numrange", "daterange", "filetype"];

export const TASK_STATE_LIST: { key: number; value: string }[] = [
  {
    key: 1,
    value: "进行中",
  },
  {
    key: 2,
    value: "已终止",
  },
  {
    key: 3,
    value: "已撤回",
  },
  {
    key: 4,
    value: "已办结",
  },
  {
    key: 5,
    value: "已驳回",
  },
  {
    key: 6,
    value: "等待中",
  },
];

export const validateRule = (value: string, errorTip: string) => {
  if (!value) {
    return Promise.reject(new Error(errorTip));
  }
  return Promise.resolve();
};
