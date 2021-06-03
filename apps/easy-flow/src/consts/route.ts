import { FlowDetailType } from '@/type/flow-detail';

const staticRoutes = {
  INDEX: '/',
  BPM_EDITOR: '/bpm-editor/:bpmId?',
  FLOW_START: '/flow/start/:subAppId',
  FLOW_DETAIL: '/flow/detail/:subAppId/:flowId/:type',
};

export default staticRoutes;

export const dynamicRoutes = {
  toFlowDetail(subAppId: string, flowId: string, type: FlowDetailType) {
    return staticRoutes.FLOW_DETAIL.replace(/:subAppId/, subAppId)
      .replace(/:flowId/, flowId)
      .replace(/:type/, String(type));
  },
  toStartFlow(subAppId: string) {
    return staticRoutes.FLOW_START.replace(/:subAppId/, subAppId);
  },
};
