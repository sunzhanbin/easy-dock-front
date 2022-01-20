import React from "react";
import { useParams } from "react-router-dom";
import emptyImage from "@assets/images/light-empty.png";
import AppInfoComponent from "@containers/app-manager-details/app-info.component";
import SubListComponent from "@containers/app-manager-details/sub-list.component";

import "@containers/app-manager-details/index.style";

const AppManagerDetails: React.FC = () => {
  const { workspaceId } = useParams();
  if (!workspaceId || workspaceId === "undefined") {
    return (
      <div className="app-manager-details">
        <div className="empty">
          <div className="container">
            <img src={emptyImage} alt="empty" className="image" />
            <div className="text">请先创建工作区</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="app-manager-details">
      <AppInfoComponent />
      <SubListComponent />
    </div>
  );
};

export default AppManagerDetails;
