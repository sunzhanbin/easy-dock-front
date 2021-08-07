import { filedRule } from '@/type';
import moment from 'moment';

export { default as axios, runtimeAxios, builderAxios } from './axios';
export { default as history } from './history';

export function getToolboxImageUrl(icon: string): string {
  const publicPath = process.env.PUBLIC_URL;
  return `${publicPath}/images/toolbox/${icon}.png`;
}

// 计算节点停留时间,精确到分
export function getStayTime(startTime: number) {
  const now = Date.now();
  let stayTime = now - startTime;
  const dayTime = 1000 * 60 * 60 * 24;
  const hourTime = 1000 * 60 * 60;
  const minuteTime = 1000 * 60;
  let days = Math.floor(stayTime / dayTime);
  let hours = Math.floor((stayTime - days * dayTime) / hourTime);
  let minutes = Math.round((stayTime - days * dayTime - hours * hourTime) / minuteTime);
  let result = '';
  if (days > 0) {
    result += `${days}天`;
    if (hours === 0) {
      result += '0小时';
    }
  }
  if (hours > 0) {
    result += `${hours}小时`;
  }
  result += `${minutes}分`;
  return result;
}

// 格式化时间为几分钟前这种格式
export function getPassedTime(startTime: number) {
  const now = Date.now();
  let passedTime = now - startTime;
  const dayTime = 1000 * 60 * 60 * 24;
  const hourTime = 1000 * 60 * 60;
  const minuteTime = 1000 * 60;
  // 一分钟内的，显示刚刚
  if (passedTime < minuteTime) {
    return '刚刚';
  }
  // 一小时内的,显示xx分钟前
  if (passedTime < hourTime) {
    return `${Math.floor(passedTime / minuteTime)}分钟前`;
  }
  // 1-24小时内的，显示XX小时前
  if (passedTime < dayTime) {
    return `${Math.floor(passedTime / hourTime)}小时前`;
  }
  // 昨天发起的，显示昨天 时:分；
  if (passedTime >= dayTime && passedTime < 2 * dayTime) {
    const time = moment(startTime).format('HH:mm');
    return `昨天 ${time}`;
  }
  // 前天发起的，显示前天 时:分；
  if (passedTime >= 2 * dayTime && passedTime < 3 * dayTime) {
    const time = moment(startTime).format('HH:mm');
    return `前天 ${time}`;
  }
  // 超过前天的，显示年-月-日 时:分
  if (passedTime >= 3 * dayTime) {
    return moment(startTime).format('YYYY-MM-DD HH:mm');
  }
}

export function timeDiff(milliseconds: number) {
  const timeValues: number[] = [];
  const data = [
    {
      text: '天',
      unit: 24 * 60 * 60 * 1000,
    },
    {
      text: '小时',
      unit: 60 * 60 * 1000,
    },
    {
      text: '分钟',
      unit: 60 * 1000,
    },
    {
      text: '秒',
      unit: 1000,
    },
  ];

  let diff = milliseconds;

  data.forEach((item) => {
    const value = Math.floor(diff / item.unit);

    timeValues.push(value);

    diff = diff - value * item.unit;
  });

  const timeTextArr = data.map((item, index) => {
    if (timeValues[index]) {
      return `${timeValues[index]}${item.text}`;
    } else {
      return '';
    }
  });

  return timeTextArr.join('');
}

type Rule = filedRule & { fieldName?: string; fieldType?: string };
// 格式化条件
export function formatCondition(rules: Rule[][]) {
  return rules.map((ruleBlock) => {
    return ruleBlock.map((rule) => {
      const symbol = symbolMap[rule.symbol].label;
      return Object.assign({}, rule, { symbol });
    });
  });
}

// 条件符号映射
export const symbolMap: { [k in string]: { value: string; label: string } } = {
  equal: { value: 'equal', label: '等于' },
  unequal: { value: 'unequal', label: '不等于' },
  greater: { value: 'greater', label: '大于' },
  greaterOrEqual: { value: 'greaterOrEqual', label: '大于等于' },
  less: { value: 'less', label: '小于' },
  lessOrEqual: { value: 'lessOrEqual', label: '小于等于' },
  range: { value: 'range', label: '选择范围' },
  dynamic: { value: 'dynamic', label: '动态筛选' },
  equalAnyOne: { value: 'equalAnyOne', label: '等于任意一个' },
  unequalAnyOne: { value: 'unequalAnyOne', label: '不等于任意一个' },
  include: { value: 'include', label: '包含' },
  exclude: { value: 'exclude', label: '不包含' },
  null: { value: 'null', label: '为空' },
  notNull: { value: 'notNull', label: '不为空' },
};
