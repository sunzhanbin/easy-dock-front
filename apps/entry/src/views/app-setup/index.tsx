import { useEffect } from "react";
import { useParams } from "react-router";
import AppSetupConfig from "@/containers/app-setup-config";
import AppSetupPreview from "@/containers/app-setup-preview";
import "./index.style";

const AppSetup: React.FC = () => {
  const { workspace } = useParams();

  useEffect(() => {
    console.log("workspace", workspace);
  }, [workspace]);

  return (
    <div className="app-setup">
      <AppSetupPreview />
      <AppSetupConfig />
    </div>
  );
};

export default AppSetup;
