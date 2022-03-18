import { memo, FC, useMemo } from "react";
import { Form, Radio } from "antd";
import usePrevNodes from "@/features/bpm-editor/flow-design/hooks/use-prev-nodes";
import RevertCascader from "@/features/bpm-editor/flow-design/editor/audit-node/revert-cascader";
import Condition from "./condition";
import styles from "./index.module.scss";
import { RevertType } from "@/type/flow";

interface NodeFlowConfigProps {
  name: string;
  nodeId: string;
}

const NodeFlowConfig: FC<NodeFlowConfigProps> = ({ name, nodeId }) => {
  const prevNodes = usePrevNodes(nodeId);
  const typeOptions = useMemo(() => {
    return [
      { label: "直接流转", value: 1 },
      { label: "依据条件判断", value: 2 },
    ];
  }, []);
  const failOptions = useMemo(() => {
    return [
      { label: "流程结束", value: 1 },
      { label: "驳回到指定节点", value: 2 },
    ];
  }, []);
  return (
    <Form.Item noStyle shouldUpdate>
      {() => {
        return (
          <>
            <Form.Item name={[name, "type"]} className={styles.mb0}>
              <Radio.Group optionType="button" size="large" options={typeOptions} className={styles.type}></Radio.Group>
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prev, current) => prev[name]["type"] !== current[name]["type"]}>
              {(form) => {
                const type = form.getFieldValue([name, "type"]);
                if (type === 2) {
                  return (
                    <div className={styles.conditions}>
                      <div>如果满足条件</div>
                      <Form.Item name={[name, "conditions"]}>
                        <Condition name={[name, "conditions"]} />
                      </Form.Item>
                      <div className={styles.text}>则流转到下个节点;否则</div>
                      <div>
                        <Form.Item name={[name, "failConfig", "type"]} className={styles.mb0}>
                          <Radio.Group
                            optionType="button"
                            size="large"
                            options={failOptions}
                            className={styles.type}
                          ></Radio.Group>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, current) =>
                            prev[name]["failConfig"]["type"] !== current[name]["failConfig"]["type"]
                          }
                        >
                          {(form) => {
                            const revertType = form.getFieldValue([name, "failConfig", "type"]);
                            if (revertType === 2) {
                              return (
                                <Form.Item
                                  name={[name, "failConfig", "revert"]}
                                  rules={[
                                    {
                                      validator(_, revert) {
                                        if (revert.type === RevertType.Specify && !revert.nodeId) {
                                          return Promise.reject("选择驳回到指定节点时指定节点不能为空");
                                        }

                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                  style={{ marginBottom: 0, marginTop: "12px" }}
                                >
                                  <RevertCascader prevNodes={prevNodes} />
                                </Form.Item>
                              );
                            }
                            return null;
                          }}
                        </Form.Item>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            </Form.Item>
          </>
        );
      }}
    </Form.Item>
  );
};

export default memo(NodeFlowConfig);
