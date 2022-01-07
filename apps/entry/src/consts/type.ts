// 子应用类型
export enum SubAppType {
  CANVAS = 1,
  FLOW = 2,
  CHART = 3,
  SPACE = 4,
  FORM = 5,
}

// 1=大屏类，2=流程类，3=报表类，4=HoloScene，5=表单类 6=设备 7=数据 8= 模型 9=接口 10=任务中心 11=流程数据管理
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
  TASK_CENTER = 10,
  INSTANCE_MANAGER = 11,
}
// 导航方式  双导航  左导航 顶部导航
export enum NavModeType {
  MULTI = 1,
  LEFT = 2,
  TOP = 3,
}

export enum ThemeType {
  DARK = "dark",
  LIGHT = "light",
  ORANGE = "orange",
  BLUE = "blue",
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
    token?: string;
  };
};

export enum SortDirection {
  DESC = "DESC", //倒序
  ASC = "ASC", //升序
}

export enum TaskStatus {
  DOING = 1, //进行中
  STOP = 2, //已终止
  RECALL = 3, //已撤回
  DONE = 4, //已完成
  REJECT = 5, //已驳回
  WAITING = 6, //等待中
}

export type ProcessDataManagerParams = {
  pageIndex?: number;
  pageSize?: number;
  sortDirection?: SortDirection;
  startUserId?: string;
  stateList?: TaskStatus[];
  subappId: number;
};

export type Pagination = {
  pageSize: number;
  current: number;
  total: number;
  showSizeChanger: boolean;
};

export type UserItem = {
  id: number;
  userName: string;
};
