import React from "react";
import AppInfoComponent from "@containers/app-manager-details/app-info.component";
import SubListComponent from "@containers/app-manager-details/sub-list.component";

const AppManagerDetails: React.FC = () => {
  return (
    <React.Fragment>
      <AppInfoComponent />
      <br />
      <SubListComponent />
    </React.Fragment>
  );
};

export default AppManagerDetails;
