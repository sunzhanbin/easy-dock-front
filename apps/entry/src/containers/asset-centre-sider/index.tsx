import { memo, useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { ASSET_CENTRE_MENU, AssetCentreEnum } from "@utils/const";
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
  const [activeMenu, setActiveMenu] = useState<string>("");

  useEffect(() => {
    navigate(`./${AssetCentreEnum.PLUGINS_MANAGE}`);
    setActiveMenu(AssetCentreEnum.PLUGINS_MANAGE);
  }, [navigate]);

  const renderIcon = (icon: string) => {
    return <Icon type={icon} />;
  };

  const handleMenuClick = useMemoCallback(({ key }) => {
    navigate(`./${key}`);
    setActiveMenu(key);
  });

  return (
    <div className="asset-centre-sider">
      <Sider trigger={null} collapsible width={240}>
        <div className="menu">
          <Menu mode="inline" selectedKeys={[activeMenu]} onClick={handleMenuClick}>
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
