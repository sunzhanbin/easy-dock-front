import { useParams } from "react-router-dom";
import { Layout } from "antd";
import AppManagerSider from "@containers/app-manager-sider";
import AppManagerDetails from "@containers/app-manager-details";
import "@views/app-manager/index.style.scss";

const { Content } = Layout;

const AppManager = () => {
  const { projectId, workspaceId } = useParams();

  return (
    <div className="app-manager">
      <Layout>
        {projectId && <AppManagerSider />}
        <Layout className="site-layout">
          <Content className="site-layout-background">{workspaceId && <AppManagerDetails />}</Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AppManager;
