declare type User = {
  avatar: string; // 头像
  email: string; // 邮箱
  id: number;
  cName: string; // 中文名
  nick: string; // 昵称
};

interface Window {
  COMMON_LOGIN_DOMAIN: string;
  ALGOR_ORCH_BASE_SERVICE_ENDPOINT: string;
  EASY_DOCK_BASE_SERVICE_ENDPOINT: string;
  ALGOR_ORCH_FRONTEND_ENTRY: string;
  EASY_FLOW_FRONTEND_ENTRY: string;
}

interface MicroApp {
  route: string;
  entry: string;
  name: string;
  title: string;
  description?: string;
}
