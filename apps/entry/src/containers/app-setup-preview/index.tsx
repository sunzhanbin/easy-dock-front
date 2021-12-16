import { useCallback, useEffect, useMemo } from "react";
import { useAppSelector } from "@/store";
import { selectTheme, selectNavMode } from "@views/app-setup/basic-setup.slice";
import { selectMenu, selectCurrentId } from "@views/app-setup/menu-setup.slice";
import SingleNavComponent from "@containers/app-setup-preview/single-nav.component";
import MultiNavComponent from "@containers/app-setup-preview/multi-nav.component";
import AppInfo from "@components/app-info";
import "@containers/app-setup-preview/index.style";
import { NavModeType } from "@/consts";

const AppSetupPreview = () => {
  const theme = useAppSelector(selectTheme);
  const navMode = useAppSelector(selectNavMode);
  const menu = useAppSelector(selectMenu);
  const selectedKey = useAppSelector(selectCurrentId);

  const renderContent = useCallback(() => {
    return <>这里是内容区</>;
  }, []);
  const renderNavComponent = useMemo(() => {
    if (navMode === "single") {
      return (
        <SingleNavComponent
          selectedKey={selectedKey}
          dataSource={menu}
          theme={theme}
          extra={<AppInfo navMode={NavModeType.SINGLE} />}
        >
          {renderContent()}
        </SingleNavComponent>
      );
    }
    if (navMode === "multi") {
      return (
        <MultiNavComponent
          selectedKey={selectedKey}
          dataSource={menu}
          theme={theme}
          extra={<AppInfo navMode={NavModeType.MULTI} />}
        >
          {renderContent()}
        </MultiNavComponent>
      );
    }
    return null;
  }, [navMode, theme, menu, selectedKey]);

  return <div className="app-setup-preview">{renderNavComponent}</div>;
};

export default AppSetupPreview;
