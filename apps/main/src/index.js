// import 方式加载 sso.js
import Auth from '@enc/sso';

// 引入Auth后，需要调用 Auth.setConfig 配置 server
Auth.setConfig({ server: window.SSO_LOGIN_URL });

(async () => {
  // 使用 script tag 方式加载 sso.js
  // if (!window.Auth) {
  //   console.error('SSO login 加载失败.');
  //   return;
  // }
  // window.Auth.setLoginServer(window.SSO_LOGIN_URL);
  // const token = await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  // import 方式加载 sso.js
  const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  // require 方式加载 sso.js
  // const Auth = require('../lib/sso/index.cjs.min');
  // // Auth.setLoginServer(window.SSO_LOGIN_URL);
  // const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  if (token) {
    require('./app.tsx');
  }
})();
