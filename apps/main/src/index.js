// import 方式加载 sso.js
// import Auth from '../lib/sso/index.esm';

(async () => {
  // script tag 方式加载 sso.js
  if (!window.Auth) {
    console.error('SSO login 加载失败.');
    return;
  }
  window.Auth.setLoginServer(window.SSO_LOGIN_URL);
  const token = await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  // import 方式加载 sso.js
  // Auth.setLoginServer(window.SSO_LOGIN_URL);
  // const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  // require 方式加载 sso.js
  // const Auth = require('../lib/sso/index.cjs.min');
  // // Auth.setLoginServer(window.SSO_LOGIN_URL);
  // const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  if (token) {
    require('./app.tsx');
  }
})();
