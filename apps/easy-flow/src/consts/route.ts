const staticRoutes = {
  INDEX: '/',
  BPM_EDITOR: '/bpm-editor/:bpmId',
  TASK_CENTER: '/task-center/:appId',
  FLOW_START: '/start/:subAppId',
  TASK_DETAIL: '/task/detail/:taskId',
};

export default staticRoutes;

export const dynamicRoutes = {
  toFlowDetail(taskId: string) {
    return staticRoutes.TASK_DETAIL.replace(/:taskId/, taskId);
  },
  toStartFlow(subAppId: number) {
    return staticRoutes.FLOW_START.replace(/:subAppId/, String(subAppId));
  },
  toTaskCenter(appId: number) {
    return staticRoutes.TASK_CENTER.replace(/:appId/, String(appId));
  },
};
