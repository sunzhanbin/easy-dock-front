import { Layout } from "antd";
import { useAppSelector } from "@/store";
import AppManagerSider from "@/containers/app-manager-sider";
import AppManagerDetails from "@/containers/app-manager-details";
import { selectCurrentWorkspaceId } from "./index.slice";

const { Content } = Layout;

const AppManager = () => {
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);

  return (
    <Layout>
      <AppManagerSider />
      <Layout className="site-layout">
        <Content className="site-layout-background">
          {workspaceId && <AppManagerDetails />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppManager;
