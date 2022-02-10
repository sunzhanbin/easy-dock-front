import { useState, useEffect, useMemo, FC } from "react";
import { useParams } from "react-router";
import { useAppSelector } from "@/store";
import AppInfo from "@components/app-info";
import SingleNavComponent from "@containers/workspace-running/single-nav.component";
import MultiNavComponent from "@containers/workspace-running/multi-nav.component";
import { useWorkspaceRuntimeDetailQuery } from "@http/app-manager.hooks";
import { selectCurrentId } from "@views/workspace/index.slice";
import "@containers/workspace-running/nav.style";
import { RouteMap, AuthEnum } from "@utils/const";
import { filterItem } from "@utils/utils";
import { NavModeType, SubAppType } from "@/consts";
import { useNavigate } from "react-router-dom";
import { axios } from "@/utils/fetch";

const NavComponent: FC = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const selectedKey = useAppSelector(selectCurrentId);
  const { navMode, theme, menu } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => {
      return {
        theme: data?.extension?.theme,
        navMode: data?.extension?.navMode,
        menu: data?.extension?.meta?.menuList || [],
      };
    },
  });

  const [showInstanceMangerMenu, setShowInstanceMangerMenu] = useState(false);

  const authMenu = useMemo(() => {
    if (showInstanceMangerMenu) return menu;
    const aothmenu = menu?.length && filterItem("流程数据管理", "name", menu);
    return aothmenu;
  }, [menu, showInstanceMangerMenu]);

  useEffect(() => {
    axios.get<{ data: { power: number } }>(`/app/${workspaceId}`).then(({ data }) => {
      const showInstanceMangerMenu = (data?.power & AuthEnum.DATA) === AuthEnum.DATA;
      setShowInstanceMangerMenu(showInstanceMangerMenu);
    });
  }, [workspaceId]);

  useEffect(() => {
    if (!authMenu || !authMenu.length) return;
    const activeMenuForm = authMenu[0]?.form;
    const { assetConfig } = activeMenuForm;
    const { subAppType, subAppId, url } = assetConfig;
    if (url) {
      navigate("./iframe");
    } else {
      if (subAppType === SubAppType.FLOW && subAppId) {
        navigate(`./${RouteMap[subAppType as unknown as keyof typeof RouteMap]}/instance/${subAppId}`);
      } else {
        navigate(`./${RouteMap[assetConfig.subAppType as unknown as keyof typeof RouteMap]}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMenu, workspaceId]);

  return (
    <div className="nav-component">
      {navMode === NavModeType.LEFT && (
        <SingleNavComponent
          selectedKey={selectedKey}
          dataSource={authMenu}
          theme={theme}
          extra={<AppInfo navMode={NavModeType.LEFT} theme={theme} mode="runtime" />}
        />
      )}
      {navMode === NavModeType.MULTI && (
        <MultiNavComponent
          dataSource={authMenu}
          selectedKey={selectedKey}
          theme={theme}
          extra={<AppInfo navMode={NavModeType.MULTI} theme={theme} mode="runtime" />}
        />
      )}
    </div>
  );
};

export default NavComponent;
