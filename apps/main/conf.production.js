(function (conf) {
  conf.IS_RELATIVE = true;
  conf.ALGOR_ORCH_BASE_SERVICE_ENDPOINT = "http://10.19.248.174:12126"; //算法编排后端服务地址
  conf.EASY_DOCK_BASE_SERVICE_ENDPOINT = "http://10.19.248.174:28300"; //EasyDock后端服务地址
  conf.ALGOR_ORCH_FRONTEND_ENTRY = "http://10.19.248.174:28217"; //服务编排子应用入口(接入微前端)
  conf.EASY_FLOW_FRONTEND_ENTRY = conf.IS_RELATIVE ? "/easyflow/" : "http://10.19.248.174:28301"; //EasyDock Flow子应用入口(接入微前端)
  conf.SSO_LOGIN_URL = "http://10.19.248.174:28017"; //单点登录地址
})(window);
