import { memo, FC, useState, useEffect, useMemo } from "react";
import { Collapse } from "antd";
import { Icon, Text } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { NodeType, PluginGroupItem } from "@/type/flow";
import { useSubAppDetail } from "@/app/app";
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
  { name: "子分支", icon: "jicheng", type: NodeType.BranchNode },
  { name: "抄送节点", icon: "chaosongjiedian", type: NodeType.CCNode },
  { name: "数据连接", icon: "shujulianjie", type: NodeType.AutoNodePushData },
  { name: "流程触发", icon: "liuchengchufa", type: NodeType.AutoNodeTriggerProcess },
];
// 给插件分组
const groupPluginList = (groupList: PluginGroupItem[]): NodeTypeList[] => {
  const groups = groupList.map(({ id, name, plugins }) => {
    const nodeList = plugins
      .filter((plugin) => plugin.enabled)
      .map(({ id, name }) => ({ name, id, type: NodeType.PluginNode, icon: "chajianxian" }));
    return { id: String(id), name, nodeList };
  });
  return groups;
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
  const subAppDetail = useSubAppDetail();
  const projectId = useMemo(() => {
    if (subAppDetail && subAppDetail.data && subAppDetail.data.app) {
      return subAppDetail.data.app.project.id;
    }
  }, [subAppDetail]);
  const fetchPlugin = useMemoCallback(async () => {
    const { data: groupList } = await builderAxios.get<{ data: PluginGroupItem[] }>(`/plugin/project/${projectId}`);
    const group = groupPluginList(groupList);
    setGroup((v) => v.concat(group));
  });
  const getExpandIcon = useMemoCallback((panelProps) => {
    return <Icon type={panelProps.isActive ? "xiasanjiao" : "yousanjiao"} className={styles.icon} />;
  });
  const activeKey = useMemo(() => {
    return group.map((v) => v.id);
  }, [group]);
  useEffect(() => {
    if (projectId) {
      fetchPlugin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);
  return (
    <div className={styles.toolbox}>
      <Collapse defaultActiveKey={activeKey} ghost expandIcon={getExpandIcon}>
        {group.map(({ id: groupId, name, nodeList }) => {
          return (
            <Panel header={<Text text={name} />} key={groupId} className={styles.panel}>
              <div className={styles["node-container"]}>
                {nodeList.map(({ icon, id, type, name }) => (
                  <ToolboxItem
                    icon={icon}
                    name={name}
                    id={id}
                    type={type}
                    key={name}
                    shape={groupId === "common" ? "square" : "rect"}
                  />
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
