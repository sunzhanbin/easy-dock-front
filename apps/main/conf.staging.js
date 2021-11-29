(function (conf) {
  conf.IS_RELATIVE = true;
  conf.ALGOR_ORCH_BASE_SERVICE_ENDPOINT = 'http://10.19.248.238:12126'; //算法编排后端服务地址
  conf.COMMON_LOGIN_DOMAIN = 'http://10.19.248.238:28201'; //对接统一用户的登录地址   已废弃
  conf.COMMON_LOGIN_URL = 'http://10.19.248.238:28303/login'; //EasyDock登录页地址 已废弃
  conf.EASY_DOCK_BASE_SERVICE_ENDPOINT = 'http://10.19.248.238:28300'; //EasyDock后端服务地址
  conf.ALGOR_ORCH_FRONTEND_ENTRY = 'http://10.19.248.238:28217'; //服务编排子应用入口(接入微前端)
  conf.EASY_FLOW_FRONTEND_ENTRY = conf.IS_RELATIVE ? '/easyflow/' : 'http://10.19.248.238:28301'; //EasyDock Flow子应用入口(接入微前端)
  conf.EASY_CHART_FRONTEND_ENTRY = 'http://10.19.146.100:28301'; //EasyDock Chart子应用入口(接入微前端)
  conf.SSO_LOGIN_URL = 'http://10.19.248.238:28017'; //单点登录地址
})(window);
/* (function (conf) {
  conf.IS_RELATIVE = true;
  conf.ALGOR_ORCH_BASE_SERVICE_ENDPOINT = 'http://10.19.248.238:12126';
  conf.COMMON_LOGIN_DOMAIN = 'http://10.19.248.238:28201';
  conf.COMMON_LOGIN_URL = 'http://localhost:8082/login';
  conf.EASY_DOCK_BASE_SERVICE_ENDPOINT = 'http://10.19.248.238:28300';
  conf.ALGOR_ORCH_FRONTEND_ENTRY = 'http://localhost:3000';
  conf.EASY_FLOW_FRONTEND_ENTRY = conf.IS_RELATIVE ? '/easyflow/' : 'http://localhost:8083';
  conf.EASY_CHART_FRONTEND_ENTRY = 'http://localhost:8084';
  conf.SSO_LOGIN_URL = 'http://10.19.248.238:28017';
})(window); */
