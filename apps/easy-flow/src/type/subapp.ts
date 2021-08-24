enum SubAppType {
  CANVAS = 1,
  FLOW = 2,
}

enum AppStatus {
  ON = 1,
  OFF = -1,
}

export type SubApp = {
  id: number;
  name: string;
  type: SubAppType;
  status: AppStatus;
  createTime: number;
  version: {
    id: number;
    version: string;
    remark: string;
  };
  app: {
    id: number;
    name: string;
    icon: string;
    remark: string;
    status: AppStatus;
    createTime: number;
    project: {
      id: number;
      name: string;
    };
  };
};

export enum TipType {
  WeiChat = 1,
  SMS = 2,
  Email = 3,
  Phone = 4,
}
