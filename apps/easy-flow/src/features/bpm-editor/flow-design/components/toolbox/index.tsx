import { memo, FC, useState, useEffect } from "react";
import { Collapse } from "antd";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { NodeType, PluginItem } from "@/type/flow";
import { builderAxios } from "@/utils";
import ToolboxItem, { ToolboxItemProps } from "../toolbox-item";
import styles from "./index.module.scss";

const { Panel } = Collapse;

interface NodeTypeList {
  id: string;
  name: string;
  nodeList: ToolboxItemProps[];
}
const commonNodeList: ToolboxItemProps[] = [
  { name: "填写节点", icon: "linetianxiejiedian", type: NodeType.FillNode },
  { name: "审批节点", icon: "lineshenpijiedian", type: NodeType.AuditNode },
  { name: "子分支节点", icon: "jicheng", type: NodeType.BranchNode },
  { name: "抄送节点", icon: "chaosongjiedian", type: NodeType.CCNode },
  { name: "数据连接", icon: "shujulianjie", type: NodeType.AutoNodePushData },
  { name: "流程触发", icon: "liuchengchufa", type: NodeType.AutoNodeTriggerProcess },
];
// 给插件分组
const groupPluginList = (pluginList: PluginItem[]): NodeTypeList[] => {
  const groupMap: { [k: number]: NodeTypeList } = {};
  pluginList.forEach(({ group, name, enabled, id }) => {
    // 过滤禁用的插件
    if (!enabled) {
      return;
    }
    const { id: groupId, name: groupName } = group;
    const node = { name, id, type: NodeType.PluginNode };
    if (!groupMap[groupId]) {
      groupMap[groupId] = {
        id: String(groupId),
        name: groupName,
        nodeList: [node],
      };
    } else {
      groupMap[groupId].nodeList.push(node);
    }
  });
  return Object.values(groupMap);
};

const initialGroup: NodeTypeList[] = [
  {
    id: "common",
    name: "通用节点",
    nodeList: commonNodeList,
  },
];

const Toolbox: FC = () => {
  const [group, setGroup] = useState(initialGroup);
  const fetchPlugin = async () => {
    const { data: pluginList } = await builderAxios.get<{ data: PluginItem[] }>("/plugin/list/all");
    if (pluginList.length > 0) {
      const group = groupPluginList(pluginList);
      setGroup((v) => v.concat(group));
    }
  };
  const getExpandIcon = useMemoCallback((panelProps) => {
    return <Icon type={panelProps.isActive ? "xiala" : "jinru"} className={styles.icon} />;
  });
  useEffect(() => {
    fetchPlugin();
  }, []);
  return (
    <div className={styles.toolbox}>
      <Collapse defaultActiveKey="common" ghost expandIcon={getExpandIcon}>
        {group.map(({ id, name, nodeList }) => {
          return (
            <Panel
              header={name}
              key={id}
              collapsible={id === "common" ? "disabled" : "header"}
              showArrow={id !== "common"}
              className={styles.panel}
            >
              <div className={styles["node-container"]}>
                {nodeList.map(({ icon, id, type, name }) => (
                  <ToolboxItem icon={icon} name={name} id={id} type={type} key={name} />
                ))}
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default memo(Toolbox);
