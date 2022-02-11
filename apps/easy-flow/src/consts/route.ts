import appConfig from "@/init";

const staticRoutes = {
  INDEX: "/",
  BPM_EDITOR: "/bpm-editor/:bpmId",
  TASK_CENTER: "/task-center/:appId",
  TASK_CENTER_WITH_NO_APPID: "/task-center",
  PROCESS_DATA_MANAGE: "/data-manage/:appId",
  PROCESS_DATA_MANAGE_WITH_NO_APPID: "/data-manage",
  START_FLOW: "/start/flow/:subAppId",
  START_DETAIL: "/start/detail/:flowId",
  TASK_DETAIL: "/task/detail/:taskId",
  FLOW_INSTANCE_LIST: "/instance/:subAppId",
};

export default staticRoutes;

export const dynamicRoutes = {
  toTaskDetail(taskId: string): string {
    return staticRoutes.TASK_DETAIL.replace(/:taskId/, taskId);
  },
  toStartFlow(subAppId: number): string {
    return staticRoutes.START_FLOW.replace(/:subAppId/, String(subAppId));
  },
  toStartDetail(flowId: string): string {
    return staticRoutes.START_DETAIL.replace(/:flowId/, flowId);
  },
  toTaskCenter(appId: number): string {
    if (appConfig.appId) {
      return staticRoutes.TASK_CENTER_WITH_NO_APPID;
    }
    return staticRoutes.TASK_CENTER.replace(/:appId/, String(appId));
  },
  toFlowInstanceList(subAppId: number): string {
    return staticRoutes.FLOW_INSTANCE_LIST.replace(/:subAppId/, String(subAppId));
  },
};

export const FLOW_ENTRY = process.env.REACT_APP_FLOW_FRONTEND_ENTRY;

export const TASK_STATE_LIST: { key: number; value: string }[] = [
  { key: 1, value: "进行中" },
  { key: 2, value: "已终止" },
  { key: 3, value: "已撤回" },
  { key: 4, value: "已办结" },
  { key: 5, value: "已驳回" },
  { key: 6, value: "等待中" },
];
