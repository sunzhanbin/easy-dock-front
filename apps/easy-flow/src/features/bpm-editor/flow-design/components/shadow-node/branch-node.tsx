import { memo, FC, ReactNode } from "react";
import { Button } from "antd";
import { Icon } from "@common/components";
import { NodeType } from "@/type/flow";
import styles from "./branch-node.module.scss";

const branches = [
  {
    id: "1",
    nodes: [],
    conditions: [],
    type: NodeType.SubBranch,
  },
  {
    id: "2",
    nodes: [],
    conditions: [],
    type: NodeType.SubBranch,
  },
];

function Branch() {
  return (
    <div className={styles.branch}>
      <span className={styles.line} />
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.conditions}>
            <div className={styles.or}>
              <div className={styles.and}>所有数据都可进入该分支</div>
            </div>
            <div className={styles.desc}>
              <Icon type="peizhi" />
              <span>配置筛选条件</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BranchNode: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className={styles["branch-node"]}>
      <Button className={styles["add-branch-button"]} type="primary" icon={<Icon type="guanbi" />} />
      <div className={styles.branchs}>
        {branches.map((branch) => (
          <Branch key={branch.id} />
        ))}
      </div>
    </div>
  );
};

export default memo(BranchNode);
