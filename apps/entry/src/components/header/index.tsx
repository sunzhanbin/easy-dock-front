import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@assets/images/logo.svg";
import { Icon } from "@common/components";
import classnames from "classnames";
import UserComponent from "@components/header/user";
import "@components/header/index.style.scss";
import ProjectComponent from "@components/header/project";
import NewSubAppPopover from "@components/header/new-subapp-popover.component";

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const location = useLocation();
  // 运行端首页header只有logo和用户名
  const isRuntime = location.pathname === "/runtime";
  // 首页及应用端不展示项目及其他菜单
  const isRoot = location.pathname !== "/";
  // 工作台不展示新建子应用浮框
  const showPopover = location.pathname !== "/home";

  return (
    <div className={classnames("header_container", location.pathname === "/" ? "main-header" : "")}>
      <div className="header_content">
        <Link to={!isRuntime ? "/" : "/runtime"} className="logo">
          <img src={logo} alt="logo" />
        </Link>
        {isRoot && !isRuntime ? <ProjectComponent /> : <div className="no-project" />}
        {isRoot && !isRuntime && children}
        <div className="right">
          {!isRuntime && (
            <>
              {isRoot ? (
                <>
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
            </>
          )}
          <div className="user_info">
            <UserComponent showProject={isRoot} />
          </div>
        </div>
      </div>
    </div>
  );
}
