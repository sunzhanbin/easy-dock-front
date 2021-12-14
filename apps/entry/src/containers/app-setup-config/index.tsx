import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Tabs } from "antd";
import BasicSetupFormComponent from "@containers/app-setup-config/basic-setup-form.component";
import MenuSetupComponent from "@containers/app-setup-config/menu-setup.component";
import { useParams } from "react-router-dom";
import { useWorkspaceDetailQuery } from "@/http";
import "@containers/app-setup-config/index.style";

const { TabPane } = Tabs;

type BasicSetupFormComponentHandle = React.ElementRef<
  typeof BasicSetupFormComponent
>;
type WorkspaceItem = {
  id: number;
  name: string;
};

const AppSetupConfig = () => {
  const { workspaceId } = useParams();
  const { data: workspace } = useWorkspaceDetailQuery(+(workspaceId as string));
  const [workspaceList, setWorkspaceList] = useState<WorkspaceItem[]>([]);
  const initialBasicSetup = useMemo(() => {
    if (!workspace?.id) {
      return {};
    }
    return Object.assign({}, workspace.extension, {
      workspace: workspace.id,
      icon: workspace.extension?.icon ? [workspace.extension?.icon] : undefined,
    });
  }, [workspace?.id]);
  const formRef = useRef<BasicSetupFormComponentHandle>(null);

  useEffect(() => {
    if (workspace?.id) {
      setWorkspaceList([{ id: workspace.id, name: workspace.name }]);
    }
  }, [workspace?.id]);

  // 左边预览点击菜单可能需要关联到这里的菜单设置；
  const handleTasChange = useCallback((activeKey: string) => {
    console.log("activeKey", activeKey);
  }, []);

  return (
    <div className="app-setup-config">
      <Tabs defaultActiveKey="app" onChange={handleTasChange}>
        <TabPane tab="菜单设置" key="menu">
          <MenuSetupComponent />
        </TabPane>
        <TabPane tab="应用设置" key="app">
          <BasicSetupFormComponent
            ref={formRef}
            workspaceList={workspaceList}
            initialBasicSetup={initialBasicSetup}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AppSetupConfig;
