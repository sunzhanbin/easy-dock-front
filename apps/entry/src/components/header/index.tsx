import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@assets/images/logo.png";
import Icon from "@assets/icon";
import UserComponent from "@components//header/user";
import "@components/header/index.style.scss";
import ProjectComponent from "@components/header/project";
import NewSubAppPopover from "@components/header/new-subapp-popover.component";

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const location = useLocation();
  const showPopover = location.pathname !== "/";
  return (
    <div className="header_container">
      <div className="header_content">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>
        <ProjectComponent />
        {children}
        <div className="right">
          {showPopover ? <NewSubAppPopover /> : ""}
          <Icon className="icon" type="custom-icon-shezhi" />
          <Icon className="icon" type="custom-icon-shuoming" />
          <div className="user_info">
            <UserComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
