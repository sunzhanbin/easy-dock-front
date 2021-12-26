export type UserItem = {
  id: number;
  userName: string;
};

export enum SortDirection {
  DESC = "DESC", //倒序
  ASC = "ASC", //升序
}

export type Pagination = {
  pageSize: number;
  current: number;
  total: number;
  showSizeChanger: boolean;
};

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