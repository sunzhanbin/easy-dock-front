import appConfig from '@/init';

const staticRoutes = {
  INDEX: '/',
  BPM_EDITOR: '/bpm-editor/:bpmId',
  TASK_CENTER: '/task-center/:appId',
  TASK_CENTER_WITH_NO_APPID: '/task-center',
  PROCESS_DATA_MANAGE: '/data-manage',
  START_FLOW: '/start/flow/:subAppId',
  START_DETAIL: '/start/detail/:flowId',
  TASK_DETAIL: '/task/detail/:taskId',
};

export default staticRoutes;

export const dynamicRoutes = {
  toTaskDetail(taskId: string) {
    return staticRoutes.TASK_DETAIL.replace(/:taskId/, taskId);
  },
  toStartFlow(subAppId: number) {
    return staticRoutes.START_FLOW.replace(/:subAppId/, String(subAppId));
  },
  toStartDetail(flowId: string) {
    return staticRoutes.START_DETAIL.replace(/:flowId/, flowId);
  },
  toTaskCenter(appId: number) {
    if (appConfig.appId) {
      return staticRoutes.TASK_CENTER_WITH_NO_APPID;
    }

    return staticRoutes.TASK_CENTER.replace(/:appId/, String(appId));
  },
};
