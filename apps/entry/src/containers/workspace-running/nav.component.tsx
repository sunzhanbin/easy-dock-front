import { useState, useEffect, useMemo, FC } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store";
import AppInfo from "@components/app-info";
import SingleNavComponent from "@containers/workspace-running/single-nav.component";
import MultiNavComponent from "@containers/workspace-running/multi-nav.component";
import { useWorkspaceRuntimeDetailQuery } from "@http/app-manager.hooks";
import { selectCurrentId, setCurrentId } from "@views/workspace/index.slice";
import "@containers/workspace-running/nav.style";
import { RouteMap, AuthEnum } from "@utils/const";
import { filterItem } from "@utils/utils";
import { NavModeType, SubAppType } from "@/consts";
import { useNavigate } from "react-router-dom";
import { axios } from "@/utils/fetch";
import { useLocation } from "react-router-dom";

const NavComponent: FC = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
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
    const reg = /^\/workspace\/\d+$/;
    /* 只有在新窗口打开应用端时才做响应重定向跳转  2022-02-22 */
    if (reg.test(location.pathname)) {
      if (url) {
        navigate("./iframe");
      } else {
        if (subAppType === SubAppType.FLOW && subAppId) {
          navigate(`./${RouteMap[subAppType as unknown as keyof typeof RouteMap]}/${subAppId}`);
        } else {
          navigate(`./${RouteMap[assetConfig.subAppType as unknown as keyof typeof RouteMap]}`);
        }
      }
    } else {
      const activeMenuId = window.sessionStorage.getItem("activeMenuId");
      if (activeMenuId) {
        dispatch(setCurrentId(activeMenuId));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMenu, workspaceId, location.pathname]);

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
