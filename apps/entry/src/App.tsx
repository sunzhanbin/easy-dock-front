import React from "react";
import { ConfigProvider } from "antd";
import AuthProvider from "./auth-provider";
import zh_CN from "antd/es/locale/zh_CN";
import "swiper/swiper-bundle.css";
import "moment/locale/zh-cn";
import { Routes, Route } from "react-router-dom";
import Layout from "@containers/layout";
import SuspenseWrap from "@components/suspense-wrap";
import Home from "@views/home";
import Main from "@views/main";
import "@/App.scss";
import cookie from "js-cookie";
import "@theme/src/variable.scss";

import { registerTheme } from "@theme/src/utils";
import Empty from "@common/components/empty";
import { auth } from "./consts";
import { useAppSelector } from "@/store";
import { selectIsAdmin } from "@views/home/index.slice";

const AppManager = React.lazy(() => import("@views/app-manager"));
const AppSetup = React.lazy(() => import("@views/app-setup"));
const FlowApp = React.lazy(() => import("@views/flow-app"));
const AssetCentre = React.lazy(() => import("@views/asset-centre"));
const TemplateMall = React.lazy(() => import("@views/template-mall"));
const Workspace = React.lazy(() => import("@views/workspace"));
const Auth = React.lazy(() => import("@views/auth"));
const NoMatch = React.lazy(() => import("@views/no-match"));
const EmptyPage = React.lazy(() => import("@containers/asset-pages/empty-page"));
const RuntimeRoot = React.lazy(() => import("@containers/workspace-running/runtime-root"));
auth.setConfig({ server: process.env.REACT_APP_SSO_LOGIN_URL });
const query = decodeURIComponent(window.location.href.split("?")[1]);
const theme = new URLSearchParams(query).get("theme");

if (theme) {
  cookie.set("theme", theme);
  registerTheme({
    theme,
  });
}
const App: React.FC = () => {
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <ConfigProvider locale={zh_CN} virtual={false} renderEmpty={Empty}>
      <Routes>
        <Route path="/*" element={<Layout />}>
          <Route index element={<Main />} />
          <Route
            path="home"
            element={
              <AuthProvider>
                <Home />
              </AuthProvider>
            }
          />
          {/* 超级管理员才可以进行权限设置 */}
          {isAdmin && <Route path="user-auth" element={<SuspenseWrap render={<Auth />} />} />}
          <Route path="asset-centre" element={<SuspenseWrap render={<AssetCentre />} />} />
          {/* 超级管理员不能去运行端  只有普通租户可以 */}
          {!isAdmin && <Route path="runtime" element={<SuspenseWrap render={<RuntimeRoot />} />} />}{" "}
          <Route path="app-manager/project/:projectId/workspace/:workspaceId">
            <Route index element={<SuspenseWrap render={<AppManager />} />} />
            <Route path="setup/*" element={<SuspenseWrap render={<AppSetup />} />} />
          </Route>
          {/*因为要支持新窗口打开流程子应用,故加这么一个路由  */}
          <Route path="app/:appId/flow-app/:subAppId" element={<SuspenseWrap render={<FlowApp />} />} />
          {/*因为要支持新窗口打开空状态的应用，故加这么一个路由  */}
          <Route path="app/:workspaceId/empty" element={<SuspenseWrap render={<EmptyPage />} />} />
          <Route path="template-mall" element={<SuspenseWrap render={<TemplateMall />} />} />
          <Route path="workspace/*" element={<SuspenseWrap render={<Workspace />} />} />
          <Route path="*" element={<SuspenseWrap render={<NoMatch />} />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
