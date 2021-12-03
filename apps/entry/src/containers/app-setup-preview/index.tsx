import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/store";
import { NavMenuComponentProps } from "@utils/types";
import { selectTheme, selectNavMode } from "@views/app-setup/basic-setup.slice";
import { selectMenu, selectCurrentId } from "@views/app-setup/menu-setup.slice";
import SingleNavComponent from "@containers/app-setup-preview/single-nav.component";
import MultiNavComponent from "@containers/app-setup-preview/multi-nav.component";
import "@containers/app-setup-preview/index.style";

const NavMenuComponent = ({
  extra,
  navMode,
  selectedKey,
  dataSource,
  children,
}: NavMenuComponentProps) => {
  return (
    <div className="nav-menu-component">
      {navMode === "single" && (
        <SingleNavComponent
          selectedKey={selectedKey}
          dataSource={dataSource}
          extra={extra}
        >
          {children}
        </SingleNavComponent>
      )}
      {navMode === "multi" && (
        <MultiNavComponent
          selectedKey={selectedKey}
          dataSource={dataSource}
          extra={extra}
        >
          {children}
        </MultiNavComponent>
      )}
    </div>
  );
};

const AppSetupPreview = () => {
  const theme = useAppSelector(selectTheme);
  const navMode = useAppSelector(selectNavMode);
  const menu = useAppSelector(selectMenu);
  const selectedKey = useAppSelector(selectCurrentId);

  const appInfo = useMemo(() => {
    if (navMode === "single") return <div>single app Info</div>;
    if (navMode === "multi") return <div>multi app info</div>;
  }, [navMode]);

  useEffect(() => {
    console.log(
      "%c^_^ \n\n",
      "color: #C80815; font-weight: bolder",
      JSON.stringify({ theme, navMode }, null, 2)
    );
  }, [theme, navMode]);

  return (
    <div className="app-setup-preview">
      <NavMenuComponent
        selectedKey={selectedKey}
        dataSource={menu}
        navMode={navMode}
        extra={appInfo}
      >
        这里是内容区
      </NavMenuComponent>
    </div>
  );
};

export default AppSetupPreview;
