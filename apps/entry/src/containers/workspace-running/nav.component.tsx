import { useParams } from "react-router";
import { useAppSelector } from "@/store";
import AppInfo from "@components/app-info";
import SingleNavComponent from "@containers/workspace-running/single-nav.component";
import MultiNavComponent from "@containers/workspace-running/multi-nav.component";
import { useWorkspaceDetailQuery } from "@http/app-manager.hooks";
import { selectCurrentId } from "@views/workspace/index.slice";
import "@containers/workspace-running/nav.style";

import { NavModeType } from "@/consts";

const NavComponent = () => {
  const { workspaceId } = useParams();
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
