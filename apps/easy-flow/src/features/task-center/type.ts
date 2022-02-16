export type Pagination = {
  pageSize: number;
  current: number;
  total: number;
  showSizeChanger: boolean;
};

export type TodoItem = {
  processDefinitionName: string;
  processInstanceId: string;
  startTime: number;
  starter: string;
  dueState: 0 | 1 | 2; // 0-未配置超时信息   1-超时   2-未超时
  taskCreateTime: number;
  taskDefKey: string;
  taskId: string;
  taskName: string;
};

export type CopyItem = {
  copyTime: number;
  copyUser: string;
  currentNodeId?: string;
  currentNodes?: {
    currentNode: string;
    currentNodeId: string;
    currentNodeStartTime: number;
  }[];
  processInstanceId: string;
  processName: string;
  state: 1 | 2 | 3 | 4 | 5;
};

export type currentNodeItem = {
  currentNode: string;
  currentNodeId: string;
  currentNodeStartTime: number | null;
  dueState?: 0 | 1 | 2;
};

export type StartItem = {
  currentNode: string;
  currentNodeId: string;
  currentNodeStartTime: number | null;
  currentNodes: currentNodeItem[];
  endTime: number;
  processInstanceId: string;
  processName: string;
  startTime: number;
  state: number;
};

export type DoneItem = {
  currentNodeName: string;
  currentNodeId: string;
  endTime: number;
  processName: string;
  startTime: number;
  startUser: string;
  taskId: string;
};

export type UserItem = {
  id: number;
  userName: string;
};

export type SubAppItem = {
  createTime: number;
  id: number;
  name: string;
  status: number;
  type: 1 | 2;
};

export type App = {
  id: string;
  name: string;
  project?: {
    id: number;
    name: string;
  };
};

export type TaskCenterState = {
  todoNum: number;
  theme: string;
  mode: string;
  app?: App;
};
