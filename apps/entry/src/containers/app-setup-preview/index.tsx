import { useCallback, useEffect } from "react";
import { useAppSelector } from "@/store";
import { selectTheme, selectNavMode } from "@views/app-setup/basic-setup.slice";
import { selectMenu, selectCurrentId } from "@views/app-setup/menu-setup.slice";
import SingleNavComponent from "@containers/app-setup-preview/single-nav.component";
import MultiNavComponent from "@containers/app-setup-preview/multi-nav.component";
import { SingleNavAppInfo, MultiNavAppInfo } from "@components/app-info";
import "@containers/app-setup-preview/index.style";

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

  const renderContent = useCallback(() => {
    return <>这里是内容区</>;
  }, []);

  return (
    <div className="app-setup-preview">
      {navMode === "single" && (
        <SingleNavComponent
          selectedKey={selectedKey}
          dataSource={menu}
          extra={<SingleNavAppInfo />}
        >
          {renderContent()}
        </SingleNavComponent>
      )}
      {navMode === "multi" && (
        <MultiNavComponent
          selectedKey={selectedKey}
          dataSource={menu}
          extra={<MultiNavAppInfo />}
        >
          {renderContent()}
        </MultiNavComponent>
      )}
    </div>
  );
};

export default AppSetupPreview;
