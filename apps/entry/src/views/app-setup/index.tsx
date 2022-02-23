import React from "react";
import AppSetupConfig from "@containers/app-setup-config";
import AppSetupPreview from "@containers/app-setup-preview";
import "@views/app-setup/index.style";

const AppSetup: React.FC = () => {
  return (
    <div className="app-setup">
      <AppSetupPreview />
      <AppSetupConfig />
    </div>
  );
};

export default AppSetup;
