import { useEffect } from "react";
import { useAppSelector } from "@/store";
import { NavMenuComponentProps } from "@utils/types";
import { selectTheme, selectNavMode } from "@views/app-setup/basic-setup.slice";
import { selectMenu, selectCurrentId } from "@views/app-setup/menu-setup.slice";
import SingleNavComponent from "@containers/app-setup-preview/single-nav.component";
import MultiNavComponent from "@containers/app-setup-preview/multi-nav.component";
import { SingleNavAppInfo, MultiNavAppInfo } from "@components/app-info";
import "@containers/app-setup-preview/index.style";

const NavMenuComponent = ({
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
          extra={<SingleNavAppInfo />}
        >
          {children}
        </SingleNavComponent>
      )}
      {navMode === "multi" && (
        <MultiNavComponent
          selectedKey={selectedKey}
          dataSource={dataSource}
          extra={<MultiNavAppInfo />}
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
      >
        这里是内容区
      </NavMenuComponent>
    </div>
  );
};

export default AppSetupPreview;
