// 子应用类型
export enum SubAppType {
  CANVAS = 1,
  FLOW = 2,
  CHART = 3,
  SPACE = 4,
  FORM = 5,
}

// 1=大屏类，2=流程类，3=报表类，4=HoloScene，5=表单类 6=设备 7=数据 8= 模型 9=接口
export enum HomeSubAppType {
  CANVAS = 1,
  FLOW = 2,
  CHART = 3,
  SPACE = 4,
  FORM = 5,
  DEVICE = 6,
  DATA = 7,
  DATA_FISH = 8,
  INTERFACE = 9,
}
// 导航方式  双导航  左导航
export enum NavModeType {
  MULTI = 1,
  LEFT = 2,
}

export enum ThemeType {
  DARK = "dark",
  LIGHT = "light",
}

export const APP_TYPE = 0;

export interface SubAppInfo {
  id: number;
  createTime: number;
  name: string;
  openVisit: boolean;
  status: -1 | 1; // -1 停用 1 启用
  type: SubAppType;
  version: {
    id: number;
    remark: string;
    version: string;
  };
}

export type ResponseType = {
  [key: string]: any;
};

export type CanvasResponseType = {
  data: {
    refId: string;
  };
};
