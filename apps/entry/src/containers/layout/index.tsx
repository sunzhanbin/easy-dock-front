import { Layout as LayoutWrap } from "antd";
import { Outlet, Routes, Route } from "react-router-dom";
import HomeHeader from "./home-header.component";
import AppManagerHeader from "./app-manager-header.component";

import "./index.style";

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
