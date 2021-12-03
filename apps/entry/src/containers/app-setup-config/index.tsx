import { useCallback } from "react";
import { Tabs } from "antd";
import BasicSetupFormComponent from "@containers/app-setup-config/basic-setup-form.component";
import MenuSetupComponent from "@containers/app-setup-config/menu-setup.component";
import "@containers/app-setup-config/index.style";

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
          <BasicSetupFormComponent />
        </TabPane>
        <TabPane tab="菜单设置" key="2">
          <MenuSetupComponent />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AppSetupConfig;
