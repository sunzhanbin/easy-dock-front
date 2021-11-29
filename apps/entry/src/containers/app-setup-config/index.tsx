import { useCallback } from "react";
import { Tabs } from "antd";
import BasicFormComponent from "./basic-setup.component";
import MenuFormComponent from "./menu-setup.component";
import "./index.style";

const { TabPane } = Tabs;

const AppSetupConfig = () => {
  // 左边预览点击菜单可能需要关联到这里的菜单设置；
  const handleTasChange = useCallback((activeKey: string) => {
    console.log("activeKey", activeKey);
  }, []);

  return (
    <div className="app-setup-config">
      <Tabs defaultActiveKey="1" onChange={handleTasChange}>
        <TabPane tab="应用设置" key="1">
          <BasicFormComponent />
        </TabPane>
        <TabPane tab="菜单设置" key="2">
          <MenuFormComponent />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AppSetupConfig;
