import { Layout as LayoutWrap } from "antd";
import { Outlet, Routes, Route } from "react-router-dom";
import HomeHeader from "@containers/layout/home-header.component";
import AppManagerHeader from "@containers/layout/app-manager-header.component";

import "@containers/layout/index.style";

const { Header, Content } = LayoutWrap;

const Layout: React.FC = () => {
  return (
    <LayoutWrap>
      <Header>
        <Routes>
          <Route path="app-manager/:id" element={<AppManagerHeader />} />
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
