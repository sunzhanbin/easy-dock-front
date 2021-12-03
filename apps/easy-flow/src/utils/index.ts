import moment from 'moment';
import {AbstractTooltipProps} from "antd/lib/tooltip";

export {default as axios, runtimeAxios, builderAxios} from './axios';
export {default as history} from './history';
export * from './form';

export const getPopupContainer: AbstractTooltipProps['getPopupContainer'] = (container) => container;

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
  let minutes = Math.floor((stayTime - days * dayTime - hours * hourTime) / minuteTime);
  let result = '';
  if (days > 0) {
    result += `${days}天`;
    if (hours === 0) {
      result += '0小时';
    }
  }
  if (hours > 0) {
    result += `${hours < 10 ? '0' + hours : hours}小时`;
  }
  if (minutes > 0) {
    result += `${minutes < 10 ? '0' + minutes : minutes}分`;
  } else {
    result += '0分';
  }
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
    return moment(startTime).format('yyyy-MM-dd HH:mm');
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
// 替代eval
export function evalPro(str: string) {
  const Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
  return new Fn(`return ${str}`)();
}
