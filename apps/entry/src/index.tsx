// import 方式加载 sso.js
import Auth from "@enc/sso";

// 引入Auth后，需要调用 Auth.setConfig 配置 server
Auth.setConfig({ server: process.env.REACT_APP_SSO_LOGIN_URL });

(async () => {
  // import 方式加载 sso.js
  const token = await Auth.getToken(
    true,
    process.env.REACT_APP_EASY_DOCK_BASE_SERVICE_ENDPOINT as string
  );
  console.log(token);
  if (token) {
    require("./main.tsx");
  }
})();
