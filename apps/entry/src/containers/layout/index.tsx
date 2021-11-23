import React from "react";
import { Outlet, NavLink, Routes, Route } from "react-router-dom";
import { Layout as LayoutWrap } from "antd";

import "./index.style";

const { Header, Content } = LayoutWrap;

const HomeHeader = () => {
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

const AppManager = () => {
  return <>这里是应用管理路由</>;
};

const Layout = () => {
  return (
    <LayoutWrap>
      <Header>
        <Routes>
          <Route path="app-manager/:id" element={<AppManager />} />
          <Route path="*" element={<HomeHeader />} />
        </Routes>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </LayoutWrap>
  );
};

export default Layout;
