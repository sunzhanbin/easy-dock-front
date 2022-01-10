// import 方式加载 sso.js
import { auth } from "./consts";

// 引入Auth后，需要调用 Auth.setConfig 配置 server
auth.setConfig({ server: process.env.REACT_APP_SSO_LOGIN_URL });

(async () => {
  // import 方式加载 sso.js
  if (window.location.pathname  === "/"){
    if (!auth.getAuth()) {
      const token = await auth.getToken(
          false,
          process.env.REACT_APP_EASY_DOCK_BASE_SERVICE_ENDPOINT as string
      );
      if (token) {
        require("./main.tsx");
        return
      }
    }
    require("./main.tsx");
  } else {
    const token = await auth.getToken(
        true,
        process.env.REACT_APP_EASY_DOCK_BASE_SERVICE_ENDPOINT as string
    );
    if (token) {
      require("./main.tsx");
    }
  }

})();
