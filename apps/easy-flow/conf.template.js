(function (conf) {
  conf.IS_RELATIVE = true; //主应用是否通过相对路经指向子应用
  conf.EASY_DOCK_BASE_SERVICE_ENDPOINT = 'http://{{external_backend_ip}}:28300'; //EasyDock后端服务地址
  conf.ALGOR_ORCH_BASE_SERVICE_ENDPOINT = 'http://10.19.248.174:12126'; //算法编排后端服务地址
  conf.SSO_LOGIN_URL = 'http://10.19.248.174:28017'; //单点登录地址
})(window);
