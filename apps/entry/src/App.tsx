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
import { registerTheme } from "@enc/theme-scheme/dist/utils.esm";
import Empty from "@common/components/empty";
import { auth } from "./consts";
const AppManager = React.lazy(() => import("@views/app-manager"));
const AppSetup = React.lazy(() => import("@views/app-setup"));
const FlowApp = React.lazy(() => import("@views/flow-app"));
const AssetCentre = React.lazy(() => import("@views/asset-centre"));
const TemplateMall = React.lazy(() => import("@views/template-mall"));
const Workspace = React.lazy(() => import("@views/workspace"));
const NoMatch = React.lazy(() => import("@views/no-match"));
const EmptyPage = React.lazy(() => import("@containers/asset-pages/empty-page"));
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
          <Route path="asset-centre" element={<SuspenseWrap render={<AssetCentre />} />} />
          <Route path="app-manager/project/:projectId/workspace/:workspaceId">
            <Route index element={<SuspenseWrap render={<AppManager />} />} />
            <Route path="setup" element={<SuspenseWrap render={<AppSetup />} />} />
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
