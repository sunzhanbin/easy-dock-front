import moment from "moment";
import { AbstractTooltipProps } from "antd/lib/tooltip";
import { FormMeta } from "@/type";
import { Flow } from "@/type/flow";

export { default as axios, runtimeAxios, builderAxios } from "./axios";
export { default as history } from "./history";
export * from "./form";

export const getPopupContainer: AbstractTooltipProps["getPopupContainer"] = (container) => container;

export function getToolboxImageUrl(icon: string): string {
  const publicPath = process.env.PUBLIC_URL;
  return `${publicPath}/images/toolbox/${icon}.png`;
}

// 计算节点停留时间,精确到分
export function getStayTime(startTime: number) {
  const now = Date.now();
  const stayTime = now - startTime;
  const dayTime = 1000 * 60 * 60 * 24;
  const hourTime = 1000 * 60 * 60;
  const minuteTime = 1000 * 60;
  const days = Math.floor(stayTime / dayTime);
  const hours = Math.floor((stayTime - days * dayTime) / hourTime);
  const minutes = Math.floor((stayTime - days * dayTime - hours * hourTime) / minuteTime);
  let result = "";
  if (days > 0) {
    result += `${days}天`;
    if (hours === 0) {
      result += "0小时";
    }
  }
  if (hours > 0) {
    result += `${hours < 10 ? "0" + hours : hours}小时`;
  }
  if (minutes > 0) {
    result += `${minutes < 10 ? "0" + minutes : minutes}分`;
  } else {
    result += "0分";
  }
  return result;
}

// 格式化时间为几分钟前这种格式
export function getPassedTime(startTime: number) {
  const now = Date.now();
  const passedTime = now - startTime;
  const dayTime = 1000 * 60 * 60 * 24;
  const hourTime = 1000 * 60 * 60;
  const minuteTime = 1000 * 60;
  // 一分钟内的，显示刚刚
  if (passedTime < minuteTime) {
    return "刚刚";
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
  if (passedTime >= 0 && passedTime < dayTime) {
    const time = moment(startTime).format("HH:mm");
    return `昨天 ${time}`;
  }
  // 前天发起的，显示前天 时:分；
  if (passedTime >= dayTime && passedTime < 2 * dayTime) {
    const time = moment(startTime).format("HH:mm");
    return `前天 ${time}`;
  }
  // 超过前天的，显示年-月-日 时:分
  if (passedTime >= 3 * dayTime) {
    return moment(startTime).format("yyyy-MM-DD HH:mm");
  }
}

export function timeDiff(milliseconds: number) {
  const timeValues: number[] = [];
  const data = [
    {
      text: "天",
      unit: 24 * 60 * 60 * 1000,
    },
    {
      text: "小时",
      unit: 60 * 60 * 1000,
    },
    {
      text: "分钟",
      unit: 60 * 1000,
    },
    {
      text: "秒",
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
      return "";
    }
  });

  return timeTextArr.join("");
}
// 替代eval
export function evalPro(str: string) {
  const Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
  return new Fn(`return ${str}`)();
}

// 数值范围最大最小值需要在小数位满足时截断   而不是四舍五入
export const formatNumber = (value: any, fieldValue: { enable: boolean; precision: number }) => {
  if (value.indexOf(".") === -1) return value;
  const strLength = value.toString().split(".")[1].length;
  if (fieldValue?.enable && strLength > fieldValue.precision) {
    return value.substring(0, value.indexOf(".") + fieldValue.precision + 1);
  } else {
    if (strLength > 10) {
      return value.substring(0, value.indexOf(".") + 11);
    } else {
      return value;
    }
  }
};

export const nameRegexp = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/; //请输入1-30位的汉字、字母、数字、下划线

export const exportJsonFile = (data: any, fileName: string) => {
  if (!data) {
    console.warn("导出的数据为空");
    return;
  }
  if (!fileName) fileName = "demo";
  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4);
  }
  const blob = new Blob([data], { type: "text/json" });
  const urlObject = window.URL || window.webkitURL || window;
  const save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a") as HTMLAnchorElement;

  save_link.href = urlObject.createObjectURL(blob);
  if (fileName) {
    save_link.download = `${fileName}.json`;
  }
  save_link.click();
};

export const validateFormData = (data: FormMeta): boolean => {
  if (Array.isArray(data.components) && Array.isArray(data.layout) && data.components.length && data.layout.length) {
    return true;
  }
  return false;
};

export const validateFlowData = (data: Flow): boolean => {
  if (Array.isArray(data) && data.every((v) => v.id && v.type)) {
    return true;
  }
  return false;
};
