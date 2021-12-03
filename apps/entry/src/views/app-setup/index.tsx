import { useEffect } from "react";
import { useParams } from "react-router";
import AppSetupConfig from "@containers/app-setup-config";
import AppSetupPreview from "@containers/app-setup-preview";
import "@views/app-setup/index.style";

const AppSetup: React.FC = () => {
  const { workspace } = useParams();

  useEffect(() => {
    console.log(
      "%c^_^ \n\n",
      "color: #C80815, font-weight: bolder",
      JSON.stringify({ workspace }, null, 2)
    );
  }, [workspace]);

  return (
    <div className="app-setup">
      <AppSetupPreview />
      <AppSetupConfig />
    </div>
  );
};

export default AppSetup;
