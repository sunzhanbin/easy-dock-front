import { memo, useMemo } from "react";
import { Cascader } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { AuditNode, AllNode, BranchNode, RevertType } from "@type/flow";
import styles from "./index.module.scss";
import { Icon } from "@common/components";

interface RevertCascaderProps {
  prevNodes: Exclude<AllNode, BranchNode>[];
  value?: AuditNode["revert"];

  onChange?(value: this["value"]): void;
}

type RevertOptionsType = {
  value: string | number;
  label: string;
  children?: RevertOptionsType[];
};

function RevertCascader(props: RevertCascaderProps) {
  const { prevNodes, value, onChange } = props;

  const options = useMemo(() => {
    const opts: RevertOptionsType[] = [
      {
        value: RevertType.Start,
        label: "驳回到发起节点",
      },
      {
        value: RevertType.Prev,
        label: "驳回到上一节点",
      },
    ];

    opts.push({
      value: RevertType.Specify,
      label: "驳回到指定节点",
      children: prevNodes.map((n) => ({ value: n.id, label: n.name })),
    });

    return opts;
  }, [prevNodes]);

  const cascaderValue = useMemo(() => {
    const { type, nodeId } = value!;

    if (nodeId) {
      return [type, nodeId];
    } else {
      return [type];
    }
  }, [value]);

  const cascaderValueDisplay = useMemo(() => {
    return function (labels: string[]) {
      return labels[labels.length - 1];
    };
  }, []);

  const handleRevertNodeChange = useMemoCallback((value: any) => {
    if (!onChange) return;

    const revert: AuditNode["revert"] = {
      type: value[0] as RevertType,
    };

    if (value.length > 1) {
      revert.nodeId = value[value.length - 1] as string;
    }

    onChange(revert);
  });

  return (
    <Cascader
      className={styles.cascader}
      onChange={handleRevertNodeChange}
      // getPopupContainer={(c) => c}
      options={options}
      value={cascaderValue}
      expandTrigger="hover"
      displayRender={cascaderValueDisplay}
      suffixIcon={<Icon type="xiala" />}
      size="large"
      allowClear={false}
    />
  );
}

export default memo(RevertCascader);
