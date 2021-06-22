import ROUTES, { orchRoutes } from './route';

export const MAIN_CONTENT_CLASSNAME = 'easy-dock-content';

export const SCENE_IAMGES = {
  scene1: `scene1`,
  scene2: `scene2`,
  scene3: `scene3`,
  scene4: `scene4`,
  scene5: `scene5`,
  scene6: `scene6`,
  scene7: `scene7`,
  scene8: `scene8`,
  scene9: `scene9`,
  scene10: `scene10`,
  scene11: `scene11`,
  scene12: `scene12`,
};

export { default as ROUTES, dynamicRoutes } from './route';

export const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export { default as envs } from './envs';

// 配置微前端
export const OrchMicroApp: Readonly<MicroApp> = {
  name: 'orch',
  entry: window.ALGOR_ORCH_FRONTEND_ENTRY,
  title: '服务编排',
  route: '/micro/orch',
};

export const FlowMicroApp: Readonly<MicroApp> = {
  name: 'flow',
  entry: window.EASY_FLOW_FRONTEND_ENTRY,
  title: '流程编排',
  route: '/micro/flow',
};

// 导出微前端应用集合
export const micros: Readonly<MicroApp>[] = [OrchMicroApp, FlowMicroApp];

// 配置需要隐藏头部的url
export const shouldHideHeaderUrls = [
  OrchMicroApp.route + orchRoutes.ORCH_EDIT_GENERATION_API, // 微前端服务编排积木页面
  ROUTES.INTEGRATION_ORCH_EDIT_GENERATION_API, // 集成管理页面加载服务编排时积木页面
  FlowMicroApp.route + '/*',
  '/runtime/\\w+/task/detail/*',
  '/runtime/\\w+/start/*',
];
