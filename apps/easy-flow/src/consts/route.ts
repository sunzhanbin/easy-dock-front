import appConfig from '../init';

const staticRoutes = {
  INDEX: '/',
  BPM_EDITOR: '/bpm-editor/:bpmId',
  TASK_CENTER: appConfig.micro ? '/' : '/:id',
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
    return staticRoutes.TASK_CENTER.replace(/:appId/, String(appId));
  },
};
