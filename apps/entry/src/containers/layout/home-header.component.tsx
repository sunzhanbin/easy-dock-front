import React from "react";
import { NavLink } from "react-router-dom";
import "@containers/layout/home-header.style";

const HomeHeader: React.FC = () => {
  const activeStyle = {
    textDecoration: "underline",
  };
  return (
    <React.Fragment>
      <nav className="menu">
        <ul>
          <li>
            <NavLink
              to="/"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              开始
            </NavLink>
          </li>
          <li>
            <NavLink to="/asset-centre">资产中心</NavLink>
          </li>
          <li>
            <NavLink to="/app-manager">应用管理</NavLink>
          </li>
          <li>
            <NavLink to="/template-mall">模板商城</NavLink>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default HomeHeader;
