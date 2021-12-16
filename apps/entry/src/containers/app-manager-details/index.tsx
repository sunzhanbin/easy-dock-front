import React from "react";
import AppInfoComponent from "@containers/app-manager-details/app-info.component";
import SubListComponent from "@containers/app-manager-details/sub-list.component";

import "@containers/app-manager-details/index.style";

const AppManagerDetails: React.FC = () => {
  return (
    <div className="app-manager-details">
      <AppInfoComponent />
      <SubListComponent />
    </div>
  );
};

export default AppManagerDetails;
