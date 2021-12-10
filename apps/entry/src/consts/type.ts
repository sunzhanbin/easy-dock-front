// 子应用类型
export enum SubAppType {
  CANVAS = 1,
  FLOW = 2,
  CHART = 3,
  SPACE = 4,
  FORM = 5,
}

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
