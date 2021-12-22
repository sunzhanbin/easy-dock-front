import { Layout } from "antd";
import { useAppSelector } from "@/store";
import AppManagerSider from "@containers/app-manager-sider";
import AppManagerDetails from "@containers/app-manager-details";
import { selectCurrentWorkspaceId } from "@views/app-manager/index.slice";
import "./index.style.scss";
import { selectProjectId } from "@views/home/index.slice";

const { Content } = Layout;

const AppManager = () => {
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const projectId = useAppSelector(selectProjectId);

  return (
    <div className="app-manager">
      <Layout>
        {projectId && <AppManagerSider />}
        <Layout className="site-layout">
          <Content className="site-layout-background">
            {workspaceId && <AppManagerDetails />}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AppManager;
