import React from "react";
import { Routes, Route } from "react-router-dom";
import NavComponent from "@containers/workspace-running/nav.component";
import SuspenseWrap from "@components/suspense-wrap";
import "@containers/workspace-running/index.style";

const CanvasMicroPage = React.lazy(() => import("@containers/asset-pages/canvas-page"));

const ChartMicroPage = React.lazy(() => import("@containers/asset-pages/chart-page"));
const FlowMicroPage = React.lazy(() => import("@containers/asset-pages/flow-page"));
const FormMicroPage = React.lazy(() => import("@containers/asset-pages/form-page"));
const IframeMicroPage = React.lazy(() => import("@containers/asset-pages/iframe-page"));
const SpaceMicroPage = React.lazy(() => import("@containers/asset-pages/space-page"));
const TaskCenterMicroPage = React.lazy(() => import("@containers/asset-pages/task-center-page"));
const InstanceManagerMicroPage = React.lazy(() => import("@containers/asset-pages/instance-manager-page"));
const EmptyMicroPage = React.lazy(() => import("@containers/asset-pages/empty-page"));

const WorkspaceRunning = () => {
  return (
    <div className="workspace-running">
      <Routes>
        <Route path=":workspaceId" element={<NavComponent />}>
          <Route>
            <Route path="canvas" element={<SuspenseWrap render={<CanvasMicroPage />} />} />
            <Route path="instance/*" element={<SuspenseWrap render={<FlowMicroPage mode="running" />} />} />
            <Route path="chart" element={<SuspenseWrap render={<ChartMicroPage />} />} />
            <Route path="space" element={<SuspenseWrap render={<SpaceMicroPage />} />} />
            <Route path="form" element={<SuspenseWrap render={<FormMicroPage />} />} />
            <Route path="iframe" element={<SuspenseWrap render={<IframeMicroPage />} />} />
            <Route path="task-center" element={<SuspenseWrap render={<TaskCenterMicroPage />} />} />
            <Route path="data-manage" element={<SuspenseWrap render={<InstanceManagerMicroPage />} />} />
            <Route path="empty" element={<SuspenseWrap render={<EmptyMicroPage />} />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default WorkspaceRunning;
