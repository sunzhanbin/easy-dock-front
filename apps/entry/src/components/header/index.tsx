import { ReactNode, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@assets/images/logo.svg";
import { Icon } from "@common/components";
import classnames from "classnames";
import UserComponent from "@components/header/user";
import "@components/header/index.style.scss";
import ProjectComponent from "@components/header/project";
import { RoleEnum } from "@utils/types";
import NewSubAppPopover from "@components/header/new-subapp-popover.component";
import { useAppSelector } from "@/store";
import { selectUserInfo } from "@views/home/index.slice";

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const location = useLocation();
  const userInfo = useAppSelector(selectUserInfo);

  // 首页及应用端不展示项目及其他菜单
  const showProject = location.pathname !== "/" && location.pathname !== "/runtime";
  // 工作台不展示新建子应用浮框
  const showPopover = location.pathname !== "/home";

  // 是否有权限跳转到应用端,只有正常项目租户才有权限
  const canGoApp = useMemo(() => {
    if (userInfo && userInfo.power) {
      const { power } = userInfo;
      return (power & RoleEnum.TENEMENT) === RoleEnum.TENEMENT;
    }
    return false;
  }, [userInfo]);

  return (
    <div className={classnames("header_container", location.pathname === "/" ? "main-header" : "")}>
      <div className="header_content">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>
        {showProject ? <ProjectComponent /> : <div className="no-project" />}
        {showProject && children}
        <div className="right">
          {showProject ? (
            <>
              {canGoApp ? (
                <a href={`/runtime`} target="_blank" rel="noreferrer" className="appClient">
                  {/*<Icon type="yingyonduandinglan" className={styles.icon} />*/}
                  <span className="text">应用端</span>
                </a>
              ) : null}
              {showPopover ? <NewSubAppPopover /> : <span className="hidden" />}
              <Icon className="icon" type="shezhi" />
              <Icon className="icon" type="shuoming" />
            </>
          ) : (
            <div className="right-no-content">
              <Link to="/home" className="workspace-link">
                工作台
              </Link>
            </div>
          )}
          <div className="user_info">
            <UserComponent showProject={showProject} />
          </div>
        </div>
      </div>
    </div>
  );
}
