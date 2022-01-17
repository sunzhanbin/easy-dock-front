import React from "react";
import classnames from "classnames";
import { NavLink, useLocation } from "react-router-dom";
import Header from "@components/header";
import '@containers/layout/home-header.style';

const HomeHeader: React.FC = () => {
  const location = useLocation();
  const mainEntry = location.pathname === '/';
  return (
    <div className={classnames('home_header', mainEntry ? 'main-header': '')}>
      <Header>
        <nav className="nav_menu">
          <NavLink className={({ isActive }) => classnames({ nav: true, active: isActive })} to="/home">
            工作台
          </NavLink>
          <NavLink className={({ isActive }) => classnames({ nav: true, active: isActive })} to="/asset-centre">
            资产中心
          </NavLink>
          <NavLink className={({ isActive }) => classnames({ nav: true, active: isActive })} to="/app-manager">
            应用管理
          </NavLink>
          <NavLink className={({ isActive }) => classnames({ nav: true, active: isActive })} to="/template-mall">
            模板商城
          </NavLink>
        </nav>
      </Header>
    </div>
  );
};

export default HomeHeader;
