import React from "react";
import { useParams } from "react-router-dom";
import AppInfoComponent from "@containers/app-manager-details/app-info.component";
import SubListComponent from "@containers/app-manager-details/sub-list.component";

import "@containers/app-manager-details/index.style";

const AppManagerDetails: React.FC = () => {
  const { workspaceId } = useParams();
  return (
    <div className="app-manager-details">
      <AppInfoComponent empty={!workspaceId || workspaceId === "undefined"} />
      <SubListComponent empty={!workspaceId || workspaceId === "undefined"} />
    </div>
  );
};

export default AppManagerDetails;
