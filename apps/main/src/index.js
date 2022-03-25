// // import 方式加载 sso.js
import Auth from "@enc/sso";

const auth = new Auth();

// // 引入Auth后，需要调用 Auth.setConfig 配置 server
auth.setConfig({ server: window.SSO_LOGIN_URL });

(async () => {
  // 使用 script tag 方式加载 sso.js
  // if (!window.Auth) {
  //   console.error('SSO login 加载失败.');
  //   return;
  // }
  // window.Auth.setConfig({ server: window.SSO_LOGIN_URL, cookieKey: 'cookie-auth' });;
  // const token = await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  const { pathname, search } = window.location;

  const flowMode = new URLSearchParams(search.slice(1)).get("mode") || "edit";

  if (pathname.endsWith("/flow-design") && flowMode === "preview") {
    require("./app.tsx");
    return;
  }

  // import 方式加载 sso.js
  const token = await auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  // require 方式加载 sso.js
  // const Auth = require('../lib/sso/index.cjs.min');
  // // Auth.setLoginServer(window.SSO_LOGIN_URL);
  // const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);

  if (token) {
    require("./app.tsx");
  }
})();
