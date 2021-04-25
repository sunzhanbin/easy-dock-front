export default {
  INDEX: '/',
  LOGIN: '/login',
  SCENE_MANAGE: '/scenes',
  SCENE_DETAIL: '/scenes/:sceneId',
  INTEGRATION: '/integration',
  INTEGRATION_ORCH_INDEX: '/integration/orch',
  INTEGRATION_ORCH_INTERFACE_LIST: '/integration/orch/interface-manage',
  INTEGRATION_ORCH_REGIST_API: '/integration/orch/regist-interface',
  INTEGRATION_ORCH_EDIT_GENERATION_API: '/integration/orch/orch',
  INTEGRATION_DATA_MANAGE: '/integration/data-manage',
  INTEGRATION_MODEL_MANAGE: '/integration/model-manage',
};

export const link = {
  toSceneDetail(sceneId: string) {
    return `/scenes/${sceneId}`;
  },
};
