import { Layout as LayoutWrap } from "antd";
import { useLocation } from "react-router-dom";
import { Outlet, Routes, Route } from "react-router-dom";
import HomeHeader from "@containers/layout/home-header.component";
import AppManagerHeader from "@containers/layout/app-manager-header.component";
import "@containers/layout/index.style";
import classnames from "classnames";

const { Content } = LayoutWrap;

const Layout: React.FC = () => {
  const location = useLocation();
  const mainEntry = location.pathname === "/";
  return (
    <LayoutWrap className={classnames(mainEntry ? "main-layout" : "")}>
      <Routes>
        <Route path="app-manager/:id" element={<AppManagerHeader />} />
        <Route path="workspace/*" element={null} />
        <Route path="app-manager/preview/*" element={null} />
        <Route path="app/:appId/flow-app/:subAppId" element={null} />
        <Route path="app/:appId/empty" element={null} />
        <Route path="*" element={<HomeHeader />} />
      </Routes>
      <Content>
        <Outlet />
      </Content>
    </LayoutWrap>
  );
};

export default Layout;
