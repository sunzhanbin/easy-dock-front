import React, {Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AntdProvider from '@common/components/antd-provider';
import Layout from '@/containers/layout';
import Start from '@/views/home';
import '@/App.scss';

const AppManager  = React.lazy(() => import('@/views/app-manager'));
const AppManagerEditor = React.lazy(() => import('@/containers/app-manager-editor'));
const AssetCentre = React.lazy(() => import('@/views/asset-centre'));
const TemplateMall = React.lazy(() => import('@/views/template-mall'));
const NoMatch = React.lazy(() => import('@/views/no-match'));

const SuspenseWrap = ({render}: {render: React.ReactNode}) => (
  <>
    <Suspense fallback={null}>
      {render}
    </Suspense>
  </>
);

function App() {
  return (
    <AntdProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/*" element={<Layout />}>
            <Route index element={<Start />} />
            <Route path="asset-centre" element={<SuspenseWrap render={<AssetCentre />} />} />
            <Route path="app-manager">
              <Route index element={<SuspenseWrap render={<AppManager />} />} />
              <Route path=":workspace" element={<SuspenseWrap render={<AppManagerEditor />} />} />
            </Route>
            <Route path="template-mall" element={<SuspenseWrap render={<TemplateMall />} />} />
            <Route path="*" element={ <SuspenseWrap render={<NoMatch />} />} />
          </Route>
        </Routes>

      </Suspense>
    </AntdProvider>
  );
}

export default App;
