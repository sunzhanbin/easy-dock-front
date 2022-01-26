import { memo, FC } from "react";
import AppSetupPreview from "@containers/app-setup-preview";
import "./index.style.scss";

const AppPreview: FC = () => {
  return (
    <div className="app-preview">
      <AppSetupPreview />
    </div>
  );
};

export default memo(AppPreview);
