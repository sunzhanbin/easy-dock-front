import { memo, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Checkbox, InputNumber } from "antd";
import { Rule } from "antd/lib/form";
import debounce from "lodash/debounce";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { AuditNode, RevertType } from "@type/flow";
import MemberSelector from "../../components/member-selector";
import FieldAuths from "../../components/field-auths";
import ButtonEditor from "../../components/button-editor";
import CounterSignButtonGroup from "./countersign-btn-group";
import { updateNode } from "../../flow-slice";
import { trimInputValue } from "../../util";
import useValidateForm from "../../hooks/use-validate-form";
import usePrevNodes from "../../hooks/use-prev-nodes";
import RevertCascader from "./revert-cascader";
import { rules } from "../../validators";
import styles from "./index.module.scss";
import { validateRule } from "@utils/const";
import DueConfig from "@/features/bpm-editor/components/due-config";
import MilestoneNodeConfig from "@/features/bpm-editor/components/milestone-node-config";

interface AuditNodeEditorProps {
  node: AuditNode;
}

type FormValuesType = {
  name: string;
  correlationMemberConfig: AuditNode["correlationMemberConfig"];
  btnConfigs: {
    btnText: AuditNode["btnText"];
    revert: AuditNode["revert"];
  };
  fieldsAuths: AuditNode["fieldsAuths"];
  countersign: AuditNode["countersign"];
  progress: AuditNode["progress"];
  dueConfig: AuditNode["dueConfig"];
};

const defaultDueConfig = {
  enable: false,
  timeout: {
    unit: "day",
  },
  notice: {
    starter: false,
    assign: false,
    admin: false,
    other: false,
  },
  cycle: {
    enable: false,
    unit: "day",
  },
  action: null,
};

function AuditNodeEditor(props: AuditNodeEditorProps) {
  const dispatch = useDispatch();
  const { node } = props;
  const [form] = Form.useForm<FormValuesType>();
  const prevNodes = usePrevNodes(node.id);

  useValidateForm<FormValuesType>(form, node.id);

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      correlationMemberConfig: node.correlationMemberConfig,
      btnConfigs: {
        btnText: node.btnText,
        revert: node.revert,
      },
      fieldsAuths: node.fieldsAuths,
      countersign: node.countersign,
      progress: node.progress,
      dueConfig: node.dueConfig || defaultDueConfig,
    };
  }, [node]);

  const handleFormValuesChange = useMemoCallback(
    debounce(() => {
      const allValues: FormValuesType = form.getFieldsValue(true);

      dispatch(
        updateNode({
          ...node,
          correlationMemberConfig: allValues.correlationMemberConfig,
          name: allValues.name,
          btnText: allValues.btnConfigs.btnText,
          revert: allValues.btnConfigs.revert,
          fieldsAuths: allValues.fieldsAuths,
          countersign: allValues.countersign,
          progress: allValues.progress,
          dueConfig: allValues.dueConfig,
        }),
      );
    }, 100),
  );

  const nameRules: Rule[] = useMemo(() => {
    return [rules.name];
  }, []);

  const memberRules: Rule[] = useMemo(() => {
    return [rules.member];
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={formInitialValues}
      onValuesChange={handleFormValuesChange}
      autoComplete="off"
    >
      <Form.Item label="节点名称" name="name" rules={nameRules} required getValueFromEvent={trimInputValue}>
        <Input size="large" placeholder="请输入用户节点名称" />
      </Form.Item>
      <Form.Item label="选择办理人" name="correlationMemberConfig" rules={memberRules} required>
        <MemberSelector />
      </Form.Item>
      <Form.Item className={styles["btn-configs"]} label="操作权限" required>
        <Form.Item name={["btnConfigs", "btnText", "save"]}>
          <ButtonEditor className={styles.editor} checkable={false} btnKey="save">
            <Button size="large">保存</Button>
          </ButtonEditor>
        </Form.Item>
        <Form.Item name={["btnConfigs", "btnText", "approve"]}>
          <ButtonEditor className={styles.editor} checkable={false} btnKey="approve">
            <Button size="large" className={styles.approve}>
              同意
            </Button>
          </ButtonEditor>
        </Form.Item>

        <Form.Item name={["btnConfigs", "btnText", "revert"]}>
          <ButtonEditor className={styles.editor} checkable={false} btnKey="revert">
            <Button size="large" type="primary" danger>
              驳回
            </Button>
          </ButtonEditor>
        </Form.Item>

        <Form.Item
          name={["btnConfigs", "revert"]}
          rules={[
            {
              validator(_, revert: AuditNode["revert"]) {
                if (revert.type === RevertType.Specify && !revert.nodeId) {
                  return Promise.reject("选择驳回到指定节点时指定节点不能为空");
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <RevertCascader prevNodes={prevNodes} />
        </Form.Item>

        {/* <Form.Item name={['btnConfigs', 'btnText', 'transfer']}>
          <ButtonEditor className={styles.editor} btnKey="transfer">
            <Button size="large">转办</Button>
          </ButtonEditor>
        </Form.Item> */}

        <Form.Item name={["btnConfigs", "btnText", "terminate"]}>
          <ButtonEditor className={styles.editor} btnKey="terminate">
            <Button size="large">终止</Button>
          </ButtonEditor>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Form.Item
          name={["countersign", "enable"]}
          className={styles["countersign-checkbox__wrapper"]}
          valuePropName="checked"
        >
          <Checkbox>会签设置</Checkbox>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {(form) => {
            const { enable, type } = form.getFieldValue(["countersign"]) || {};

            if (!enable) return null;

            return (
              <>
                <Form.Item
                  className={styles["countersign-type__wrapper"]}
                  name={["countersign", "type"]}
                  initialValue={type === undefined ? 1 : undefined}
                >
                  <CounterSignButtonGroup />
                </Form.Item>

                {type === 1 ? (
                  <div className={styles["countersign-detail"]}>
                    <Form.Item
                      name={["countersign", "percent"]}
                      rules={[
                        {
                          validator(_, value) {
                            return validateRule(value, "百分比不能为空");
                          },
                        },
                      ]}
                    >
                      <InputNumber size="large" min={0} max={100} placeholder="请输入" />
                    </Form.Item>
                    <span>% 同意时进入下一节点，否则驳回</span>
                  </div>
                ) : (
                  <div className={styles["countersign-detail"]}>
                    <Form.Item
                      name={["countersign", "count"]}
                      rules={[
                        {
                          validator(_, value) {
                            return validateRule(value, "人数不能为空");
                          },
                        },
                      ]}
                    >
                      <InputNumber size="large" min={0} precision={0} placeholder="请输入" />
                    </Form.Item>
                    <span>人同意时进入下一节点，否则驳回</span>
                  </div>
                )}
              </>
            );
          }}
        </Form.Item>
      </Form.Item>
      <Form.Item label="字段权限" name="fieldsAuths">
        <FieldAuths />
      </Form.Item>
      <Form.Item name="dueConfig">
        <DueConfig name="dueConfig" showAction={true} />
      </Form.Item>
      <MilestoneNodeConfig form={form} />
    </Form>
  );
}

export default memo(AuditNodeEditor);
