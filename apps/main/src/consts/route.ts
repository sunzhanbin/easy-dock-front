export const orchRoutes = {
  ORCH_INTERFACE_LIST: '/interface-manage',
  ORCH_EDIT_GENERATION_API: '/orch',
  ORCH_REGIST_API: 'regist-interface',
  ORCH_INDEX: '',
};

const staticRoutes = {
  INDEX: '/',
  LOGIN: '/login',
  SCENE_MANAGE: '/scenes-manage',
  SCENE_DETAIL: '/scenes-detail/:sceneId',
  APP_DASHBOARD: '/dashboard/:appId',
  APP_TASK_CENTER: '/dashboard/:appId/task-center',
  INTEGRATION: '/integration',
  INTEGRATION_ORCH_INDEX: `/integration/orch${orchRoutes.ORCH_INDEX}`,
  INTEGRATION_ORCH_INTERFACE_LIST: `/integration/orch${orchRoutes.ORCH_INTERFACE_LIST}`,
  INTEGRATION_ORCH_REGIST_API: `/integration/orch${orchRoutes.ORCH_REGIST_API}`,
  INTEGRATION_ORCH_EDIT_GENERATION_API: `/integration/orch${orchRoutes.ORCH_EDIT_GENERATION_API}`,
  INTEGRATION_DATA_MANAGE: '/integration/data-manage',
  INTEGRATION_MODEL_MANAGE: '/integration/model-manage',
  TMPLATE_CENTER: '/tmpl',
  SYSTEM_MANAGE: '/system',
};

export default staticRoutes;

export const dynamicRoutes = {
  toSceneDetail(id: string) {
    return staticRoutes.SCENE_DETAIL.replace(/:sceneId$/, id);
  },
  toAppDashboard(appId: string) {
    return staticRoutes.APP_DASHBOARD.replace(/:appId/, appId);
  },
};
