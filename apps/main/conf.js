(function (conf) {
  conf.IS_RELATIVE = false;
  conf.ALGOR_ORCH_BASE_SERVICE_ENDPOINT = 'http://10.19.248.238:12126';
  conf.COMMON_LOGIN_DOMAIN = 'http://10.19.248.238:28201';
  conf.COMMON_LOGIN_URL = 'http://localhost:8082/login';
  conf.EASY_DOCK_BASE_SERVICE_ENDPOINT = 'http://10.19.248.238:28300';
  conf.ALGOR_ORCH_FRONTEND_ENTRY = 'http://localhost:3000';
  conf.EASY_FLOW_FRONTEND_ENTRY = conf.IS_RELATIVE ? '/easyflow/' : 'http://localhost:8083';
  conf.EASY_CHART_FRONTEND_ENTRY = 'http://localhost:8084';
  conf.SSO_LOGIN_URL = 'http://10.19.248.238:28017';
})(window);
