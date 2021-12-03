import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AntdProvider from "@common/components/antd-provider";
import Layout from "@containers/layout";
import Home from "@views/home";
import "@/App.scss";

const AppManager = React.lazy(() => import("@views/app-manager"));
const AppSetup = React.lazy(() => import("@views/app-setup"));
const AssetCentre = React.lazy(() => import("@views/asset-centre"));
const TemplateMall = React.lazy(() => import("@views/template-mall"));
const NoMatch = React.lazy(() => import("@views/no-match"));

const SuspenseWrap = ({ render }: { render: React.ReactNode }) => (
  <React.Fragment>
    <Suspense fallback={null}>{render}</Suspense>
  </React.Fragment>
);

const App: React.FC = () => {
  return (
    <AntdProvider>
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
              path=":workspace"
              element={<SuspenseWrap render={<AppSetup />} />}
            />
          </Route>
          <Route
            path="template-mall"
            element={<SuspenseWrap render={<TemplateMall />} />}
          />
          <Route path="*" element={<SuspenseWrap render={<NoMatch />} />} />
        </Route>
      </Routes>
    </AntdProvider>
  );
};

export default App;
