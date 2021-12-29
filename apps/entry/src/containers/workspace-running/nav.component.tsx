import { useEffect } from "react";
import { useParams } from "react-router";
import { useAppSelector } from "@/store";
import AppInfo from "@components/app-info";
import SingleNavComponent from "@containers/workspace-running/single-nav.component";
import MultiNavComponent from "@containers/workspace-running/multi-nav.component";
import { useWorkspaceDetailQuery } from "@http/app-manager.hooks";
import { selectCurrentId } from "@views/workspace/index.slice";
import "@containers/workspace-running/nav.style";
import { RouteMap } from "@utils/const";
import { NavModeType } from "@/consts";
import { useNavigate } from "react-router-dom";

const NavComponent = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const selectedKey = useAppSelector(selectCurrentId);
  const { navMode, theme, menu } = useWorkspaceDetailQuery(
    +(workspaceId as string),
    {
      selectFromResult: ({ data }) => ({
        theme: data?.extension?.theme,
        navMode: data?.extension?.navMode,
        menu: data?.extension?.meta?.menuList,
      }),
    }
  );

  useEffect(() => {
    if (!menu || !menu.length) return;
    const activeMenuForm = menu[0]?.form;
    const { assetConfig } = activeMenuForm;
    if (assetConfig?.url) {
      navigate(`./iframe`);
    } else {
      navigate(
        `./${
          RouteMap[(assetConfig.subAppType as unknown) as keyof typeof RouteMap]
        }`
      );
    }
  }, [menu, workspaceId]);

  return (
    <div className="nav-component">
      {navMode === NavModeType.LEFT && (
        <SingleNavComponent
          selectedKey={selectedKey}
          dataSource={menu}
          theme={theme}
          extra={<AppInfo navMode={NavModeType.LEFT} theme={theme} />}
        />
      )}
      {navMode === NavModeType.MULTI && (
        <MultiNavComponent
          dataSource={menu}
          selectedKey={selectedKey}
          theme={theme}
          extra={<AppInfo navMode={NavModeType.MULTI} theme={theme} />}
        />
      )}
    </div>
  );
};

export default NavComponent;
