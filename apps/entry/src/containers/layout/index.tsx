import { Layout as LayoutWrap } from "antd";
import { Outlet, Routes, Route } from "react-router-dom";
import HomeHeader from "@containers/layout/home-header.component";
import AppManagerHeader from "@containers/layout/app-manager-header.component";
import "@containers/layout/index.style";

const { Content } = LayoutWrap;

const Layout: React.FC = () => {
  return (
    <LayoutWrap>
      <Routes>
        <Route path="app-manager/:id" element={<AppManagerHeader />} />
        <Route path="workspace/*" element={null} />
        <Route path="app-manager/preview/*" element={null} />
        <Route path="*" element={<HomeHeader />} />
      </Routes>
      <Content>
        <Outlet />
      </Content>
    </LayoutWrap>
  );
};

export default Layout;
