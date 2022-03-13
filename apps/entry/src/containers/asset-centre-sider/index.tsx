import { memo } from "react";
import { Layout, Menu } from "antd";
import { ASSET_CENTRE_MENU } from "@utils/const";
import { Icon } from "@common/components";
import { useNavigate } from "react-router-dom";
import useMemoCallback from "@common/hooks/use-memo-callback";

const { Sider } = Layout;

type menuType = {
  name: string;
  icon: string;
  type: string;
};

const AssetCentreSider = () => {
  const navigate = useNavigate();

  const renderIcon = (icon: string) => {
    return <Icon type={icon} />;
  };

  const handleMenuClick = useMemoCallback(({ key }) => {
    navigate(`./${key}`);
  });

  return (
    <div className="asset-centre-sider">
      <Sider trigger={null} collapsible width={240}>
        <div className="menu">
          <Menu mode="inline" defaultSelectedKeys={["plugins-manage"]} onClick={handleMenuClick}>
            {ASSET_CENTRE_MENU.map((menu: menuType) => (
              <Menu.Item key={menu.type} icon={renderIcon(menu?.icon)}>
                {menu.name}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </Sider>
    </div>
  );
};
export default memo(AssetCentreSider);
