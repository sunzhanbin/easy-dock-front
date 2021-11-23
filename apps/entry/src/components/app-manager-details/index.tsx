import React from "react";
import AppInfoComponent from "./app-info.component";
import SubListComponent from "./sub-list.component";

const AppManagerDetails = () => {
  return (
    <React.Fragment>
      <AppInfoComponent />
      <br />
      <SubListComponent />
    </React.Fragment>
  );
};

export default AppManagerDetails;
