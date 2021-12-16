import { useAppSelector } from "@/store";
import { SingleNavAppInfo, MultiNavAppInfo } from "@components/app-info";
import { selectMenu, selectNavMode } from "@/views/workspace/index.slice";
import SingleNavComponent from "@containers/workspace-running/single-nav.component";
import MultiNavComponent from "@containers/workspace-running/multi-nav.component";
import "@containers/workspace-running/nav.style";
import { NavModeType } from "@/consts";

const NavComponent = () => {
  const menu = useAppSelector(selectMenu);
  const navMode = useAppSelector(selectNavMode);

  return (
    <div className="nav-component">
      {navMode === NavModeType.LEFT && (
        <SingleNavComponent dataSource={menu} extra={<SingleNavAppInfo />} />
      )}
      {navMode === NavModeType.MULTI && (
        <MultiNavComponent dataSource={menu} extra={<MultiNavAppInfo />} />
      )}
    </div>
  );
};

export default NavComponent;
