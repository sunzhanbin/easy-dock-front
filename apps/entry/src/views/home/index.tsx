import { Layout } from "antd";
import "@views/home/index.style.scss";
import HomeNewAPP from "@containers/home-manager/new-app-component";
import HomeWorkspaceList from "@containers/home-manager/workspace-list-component";
import HomeNewSub from '@containers/home-manager/new-sub-component';
import HeaderAssetData from '@containers/home-manager/asset-data-component';
import HeaderHelp from '@containers/home-manager/help-component';

const { Sider, Content, Footer } = Layout;
const Start = () => {
  return (
    <Layout className="home_layout">
      <Content className="home_content">
        <HomeNewSub />
        <HeaderAssetData />
        <HeaderHelp />
        <Footer className="footer">
          Copyright©2018 新智认知数字科技股份有限公司 桂公网安备 45050302000074号桂ICP备14001670号-4
        </Footer>
      </Content>
      <Sider className="home_sider">
        <HomeNewAPP />
        <HomeWorkspaceList />
      </Sider>
    </Layout>
  );
};

export default Start;
