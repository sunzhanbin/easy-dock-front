declare type User = {
  avatar: string; // 头像
  username: string; // 中文名
  id: number; //登录名
  power?: number; //权限值
  name?: string;
};

interface Window {
  COMMON_LOGIN_DOMAIN: string;
  ALGOR_ORCH_BASE_SERVICE_ENDPOINT: string;
  EASY_DOCK_BASE_SERVICE_ENDPOINT: string;
  ALGOR_ORCH_FRONTEND_ENTRY: string;
  EASY_FLOW_FRONTEND_ENTRY: string;
  EASY_CHART_FRONTEND_ENTRY: string;
  COMMON_LOGIN_URL: string;
  setImmediate(): void;
}

interface MicroApp {
  route: string;
  entry: string;
  name: string;
  title: string;
  description?: string;
}
