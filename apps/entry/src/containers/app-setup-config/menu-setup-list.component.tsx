import { Button } from "antd";
import { PlusOutlined, MenuOutlined, RestOutlined } from "@ant-design/icons";
import "./menu-setup-list.style";

const MenuSetupListComponent = ()       => {
  return (
    <div className="menu-setup-list-component">
      <div className="header">菜单设置</div>
      <div className="list">
        <div className="addMenu">
          <Button>添加一级菜单</Button>
        </div>
        <div className="menu">
          <div className="menu-item">
            <span className="text">一级菜单</span>
            <span className="acts">
              <span className="item add">
                <PlusOutlined />
              </span>
              <span className="item remove">
                <RestOutlined />
              </span>
              <span className="item drag">
                <MenuOutlined />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSetupListComponent;
