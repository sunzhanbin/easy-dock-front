// import Auth from '../lib/sso/index.esm';

(async () => {
  // script tag 方式加载 sso.js
  // if (!window.Auth) {
  //   console.error('SSO login 加载失败.');
  //   return;
  // }
  // const token = await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  // import 方式加载 sso.js
  // const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  // require 方式加载 sso.js
  const Auth = require('../lib/sso/index.cjs.min');
  const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  if (token) {
    require('./app.tsx');
  }
})();
