import React from "react";
import { Layout } from "antd";
import "@views/home/index.style.scss";
import HomeNewAPP from "@containers/home-manager/new_app_component";
import HomeWorkspaceList from "@containers/home-manager/workspace_list_component";

const { Sider, Content } = Layout;
const Start = () => {
  return (
    <Layout className="home_layout">
      <Content className="home_content">1111</Content>
      <Sider className="home_sider">
        <HomeNewAPP />
        <HomeWorkspaceList />
      </Sider>
    </Layout>
  );
};

export default Start;
