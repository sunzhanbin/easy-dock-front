import { memo, FC } from "react";
import { Layout } from "antd";
import PluginManager from "@containers/plugin-manager";
import AssetCentreSider from "@containers/asset-centre-sider";
import "@views/asset-centre/index.style.scss";

const AssetCentre: FC = () => {
  return (
    <div className="asset-center-container">
      <Layout>
        <AssetCentreSider />
        <PluginManager />
      </Layout>
    </div>
  );
};

export default memo(AssetCentre);
