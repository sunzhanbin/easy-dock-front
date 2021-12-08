import React from "react";
import { NavLink } from "react-router-dom";
import Header from "@components/header";
import "@containers/layout/home-header.style";

const HomeHeader: React.FC = () => {
  const activeStyle = {
    textDecoration: "underline",
  };
  return (
    <div className="home_header">
      <Header>
        <nav className="nav_menu">
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
      </Header>
    </div>
  );
};

export default HomeHeader;
