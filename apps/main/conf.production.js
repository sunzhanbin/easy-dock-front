(function (conf) {
  conf.ALGOR_ORCH_BASE_SERVICE_ENDPOINT = 'http://10.19.146.121:12126'; //算法编排后端服务地址
  conf.ALGOR_ORCH_FRONTEND_ENTRY = 'http://10.19.146.100:28217'; //服务编排子应用入口(接入微前端)
  conf.COMMON_LOGIN_DOMAIN = 'http://10.19.146.121:28201'; //对接统一用户的登录地址   已废弃
  conf.COMMON_LOGIN_URL = 'http://10.19.146.100:28303/login'; //EasyDock登录页地址 已废弃
  conf.EASY_DOCK_BASE_SERVICE_ENDPOINT = 'http://10.19.146.121:28300'; //EasyDock后端服务地址
  conf.EASY_FLOW_FRONTEND_ENTRY = 'http://10.19.146.100:28301'; //EasyDock Flow子应用入口(接入微前端)
  conf.EASY_CHART_FRONTEND_ENTRY = 'http://10.19.146.100:28301'; //EasyDock Chart子应用入口(接入微前端)
  conf.SSO_LOGIN_URL = 'http://10.19.146.100:28017'; //单点登录地址
})(window);
