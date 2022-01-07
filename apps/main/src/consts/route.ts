export const orchRoutes = {
  ORCH_INTERFACE_LIST: '/interface-manage',
  ORCH_EDIT_GENERATION_API: '/orch',
  ORCH_REGIST_API: 'regist-interface',
  ORCH_INDEX: '',
};

const staticRoutes = {
  INDEX: '/',
  LOGIN: '/login',
  MICRO: '/micro',
  BUILDER: '/builder',
  BUILDER_INDEX: '/builder/app',
  BUILDER_APP: '/builder/app/:appId',
  APP_RUNTIME_DETAIL: '/app/:appId',
  INSTANCE_APP: '/instance/:appId',
  APP_PROCESS: '/app/:appId/process',
  APP_PROCESS_DATA_MANAGE: '/app/:appId/process/data-manage',
  APP_TASK_CENTER: '/app/:appId/process/task-center',
  INTEGRATION: '/builder/integration',
  INTEGRATION_ORCH_INDEX: `/builder/integration/orch${orchRoutes.ORCH_INDEX}`,
  INTEGRATION_ORCH_INTERFACE_LIST: `/builder/integration/orch${orchRoutes.ORCH_INTERFACE_LIST}`,
  INTEGRATION_ORCH_REGIST_API: `/builder/integration/orch${orchRoutes.ORCH_REGIST_API}`,
  INTEGRATION_ORCH_EDIT_GENERATION_API: `/builder/integration/orch${orchRoutes.ORCH_EDIT_GENERATION_API}`,
  INTEGRATION_DATA_MANAGE: '/builder/integration/data-manage',
  INTEGRATION_MODEL_MANAGE: '/builder/integration/model-manage',
  TMPLATE_CENTER: '/builder/tmpl',
  SYSTEM_MANAGE: '/builder/system',
  USER_MANAGER: '/builder/user',
  USER_MANAGER_AUTH: '/builder/user/auth',
};

export default staticRoutes;

export const dynamicRoutes = {
  toSceneDetail(id: string) {
    return staticRoutes.BUILDER_APP.replace(/:appId$/, id);
  },
  toAppDashboard(appId: string) {
    return staticRoutes.APP_RUNTIME_DETAIL.replace(/:appId/, appId);
  },
  toAppTaskCenter(appId: string) {
    return staticRoutes.APP_TASK_CENTER.replace(/:appId/, appId);
  },
};
