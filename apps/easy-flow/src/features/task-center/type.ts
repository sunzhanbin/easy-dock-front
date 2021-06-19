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
  taskCreateTime: number;
  taskDefKey: string;
  taskId: string;
  taskName: string;
};

export type StartItem = {
  currentNode: string;
  currentNodeId: string;
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
  loginName: string;
  userName: string;
};

export type SubAppItem = {
  createTime: number;
  id: number;
  name: string;
  status: number;
  type: 1 | 2;
};

export type TaskCenterState = {
  todoNum: number;
};
