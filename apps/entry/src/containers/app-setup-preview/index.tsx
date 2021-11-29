import { useAppSelector } from "@/store";
import { selectTheme, selectNavMode } from "@/views/app-setup/index.slice";
import "./index.style";

const AppSetupPreview = () => {
  const theme = useAppSelector(selectTheme);
  const navMode = useAppSelector(selectNavMode);
  return (
    <div className="app-setup-preview">
      <div>
        <div>theme:: {theme}</div>
        <div>navMode:: {navMode}</div>
      </div>
    </div>
  );
};

export default AppSetupPreview;
