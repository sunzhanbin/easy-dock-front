import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@assets/images/logo.svg";
import { Icon } from "@common/components";
import classnames from "classnames";
import UserComponent from "@components//header/user";
import "@components/header/index.style.scss";
import ProjectComponent from "@components/header/project";
import NewSubAppPopover from "@components/header/new-subapp-popover.component";

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const location = useLocation();
  const showProject = location.pathname !== "/";
  const showPopover = location.pathname !== "/home";
  return (
    <div className={classnames("header_container", location.pathname === "/" ? 'main-header' : '')}>
      <div className="header_content">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>
        { showProject ? <ProjectComponent/>: <div className="no-project"></div>}
        {children}
        <div className="right">
          { showProject ? <>
            {showPopover ? <NewSubAppPopover /> : <a className="hidden" />}
            <Icon className="icon" type="shezhi"/>
            <Icon className="icon" type="shuoming" />
          </> : <div className="right-no-content" /> }
          <div className="user_info">
            <UserComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
