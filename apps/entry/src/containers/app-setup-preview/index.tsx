import { useMemo } from "react";
import { useAppSelector } from "@/store";
import { NavModeType } from "@/consts";
import { selectTheme, selectNavMode } from "@views/app-setup/basic-setup.slice";
import { selectMenu, selectCurrentId } from "@views/app-setup/menu-setup.slice";
import SingleNavComponent from "@containers/app-setup-preview/single-nav.component";
import MultiNavComponent from "@containers/app-setup-preview/multi-nav.component";
import AppInfo from "@components/app-info";
import AppContent from "@containers/app-setup-preview/app-content.component";
import "@containers/app-setup-preview/index.style";

const AppSetupPreview = () => {
  const theme = useAppSelector(selectTheme);
  const navMode = useAppSelector(selectNavMode);
  const menu = useAppSelector(selectMenu);
  const selectedKey = useAppSelector(selectCurrentId);

  const renderNavComponent = useMemo(() => {
    if (navMode === NavModeType.LEFT) {
      return (
        <SingleNavComponent
          selectedKey={selectedKey}
          dataSource={menu}
          theme={theme}
          extra={<AppInfo navMode={NavModeType.LEFT} theme={theme} />}
        >
          <AppContent
            selectedKey={selectedKey}
            key={selectedKey}
            theme={theme}
          />
        </SingleNavComponent>
      );
    }
    if (navMode === NavModeType.MULTI) {
      return (
        <MultiNavComponent
          selectedKey={selectedKey}
          dataSource={menu}
          theme={theme}
          extra={<AppInfo navMode={NavModeType.MULTI} theme={theme} />}
        >
          <AppContent
            selectedKey={selectedKey}
            key={selectedKey}
            theme={theme}
          />
        </MultiNavComponent>
      );
    }
    return null;
  }, [navMode, theme, menu, selectedKey]);

  return <div className="app-setup-preview">{renderNavComponent}</div>;
};

export default AppSetupPreview;
