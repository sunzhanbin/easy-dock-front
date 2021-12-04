import { Routes, Route } from "react-router-dom";
import NavComponent from "@containers/workspace-running/nav.component";
import ContentComponent from "@containers/workspace-running/content.component";
import "@containers/workspace-running/index.style";

const WorkspaceRunning = () => {
  return (
    <div className="workspace-running">
      <Routes>
        <Route path="/" element={<NavComponent />}>
          <Route path=":workspaceId" element={<ContentComponent />}></Route>
        </Route>
      </Routes>
    </div>
  );
};

export default WorkspaceRunning;
