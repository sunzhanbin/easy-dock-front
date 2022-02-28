import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@common/components";
import BaseNode from "../base-node";
import { AutoNodePushData as AutoNodeType } from "@type/flow";
import { apisSelector } from "../../flow-slice";
import styles from "./index.module.scss";
import { ApiType } from "@/type/api";

interface AutoNodeProps {
  node: AutoNodeType;
}

function AutoNodePushData(props: AutoNodeProps) {
  const { node } = props;
  const apis = useSelector(apisSelector);
  const dataConfig = useMemo(() => node.dataConfig, [node]);

  const apiName = useMemo(() => {
    const { type, url, id } = dataConfig;
    if (type === ApiType.CUSTOM) {
      return url;
    }
    const target = apis.find((item) => {
      if (item.id === id) {
        return true;
      }
      return false;
    });
    if (target) return target.name;

    return "";
  }, [apis, dataConfig]);

  return (
    <BaseNode node={node} icon={<Icon type="shujulianjiedise" />}>
      {apiName ? (
        <div className={styles.api}>
          <span className={styles.desc}>接收数据接口</span>
          <span className={styles.name}>{apiName}</span>
        </div>
      ) : (
        "请设置此节点"
      )}
    </BaseNode>
  );
}

export default memo(AutoNodePushData);
