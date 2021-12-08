import { ReactNode } from "react";
import { Link } from "react-router-dom";
// import classnames from "classnames";
import logo from "@assets/images/logo.png";
// import { Icon } from '@common/components';
// import UserComponent from './user';
import "@components/header/index.style.scss";

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  // const user = useAppSelector(userSelector);
  return (
    <div className="header_container">
      <div className="header_content">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>
        {children}
        <div className="right">{/*<UserComponent />*/}</div>
      </div>
    </div>
  );
}
