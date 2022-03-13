import { memo, FC } from "react";
import { Layout } from "antd";
import PluginManager from "@containers/plugin-manager";
import AssetCentreSider from "@containers/asset-centre-sider";
import "@views/asset-centre/index.style.scss";
import { useAppSelector } from "@/store";
import { selectIsAdmin } from "@views/home/index.slice";
import Coding from "@containers/coding";
import { useLocation } from "react-router-dom";
import { AssetCentreEnum } from "@utils/const";

const AssetCentre: FC = () => {
  const location = useLocation();
  const isAdmin = useAppSelector(selectIsAdmin);
  if (!isAdmin) return <Coding title="资产中心" />;
  return (
    <div className="asset-center-container">
      <Layout>
        <AssetCentreSider />
        {location.pathname.endsWith(AssetCentreEnum.PLUGINS_MANAGE) && <PluginManager />}
      </Layout>
    </div>
  );
};

export default memo(AssetCentre);
