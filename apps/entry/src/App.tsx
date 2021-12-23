import React, { Suspense } from "react";
import { ConfigProvider } from "antd";
import zh_CN from "antd/es/locale/zh_CN";
import "moment/locale/zh-cn";

import { Routes, Route } from "react-router-dom";
import Layout from "@containers/layout";
import SuspenseWrap from "@components/suspense-wrap";
import Home from "@views/home";
import "@/App.scss";

const AppManager = React.lazy(() => import("@views/app-manager"));
const AppSetup = React.lazy(() => import("@views/app-setup"));
const AppPreview = React.lazy(() => import("@views/app-preview"));
const AssetCentre = React.lazy(() => import("@views/asset-centre"));
const TemplateMall = React.lazy(() => import("@views/template-mall"));
const Workspace = React.lazy(() => import("@views/workspace"));
const NoMatch = React.lazy(() => import("@views/no-match"));
import Auth from "@enc/sso";
import cookie from "js-cookie";
import { registerTheme } from "@enc/theme-scheme/dist/utils.esm";

Auth.setConfig({ server: process.env.REACT_APP_SSO_LOGIN_URL });
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
    <ConfigProvider locale={zh_CN} virtual={false}>
      <Routes>
        <Route path="/*" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="asset-centre"
            element={<SuspenseWrap render={<AssetCentre />} />}
          />
          <Route path="app-manager">
            <Route index element={<SuspenseWrap render={<AppManager />} />} />
            <Route
              path="preview/:workspaceId"
              element={<SuspenseWrap render={<AppPreview />} />}
            />
            <Route
              path=":workspaceId"
              element={<SuspenseWrap render={<AppSetup />} />}
            />
          </Route>
          <Route
            path="template-mall"
            element={<SuspenseWrap render={<TemplateMall />} />}
          />
          <Route
            path="workspace/*"
            element={<SuspenseWrap render={<Workspace />} />}
          />
          <Route path="*" element={<SuspenseWrap render={<NoMatch />} />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
