import { memo, useMemo } from "react";
import { Form, Input, Checkbox } from "antd";
import { Rule } from "antd/lib/form";
import debounce from "lodash/debounce";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { AutoNodeTriggerProcess } from "@type/flow";
import { useAppDispatch } from "@/app/hooks";
import { updateNode } from "../../flow-slice";
import { trimInputValue } from "../../util";
import { rules } from "../../validators";
import useValidateForm from "../../hooks/use-validate-form";
import TriggerProcessConfig from "../../../components/trigger-process-config";
import styles from "./index.module.scss";
import MilestoneNodeConfig from "@/features/bpm-editor/components/milestone-node-config";

interface AutoNodeEditorProps {
  node: AutoNodeTriggerProcess;
}

type FormValuesType = {
  name: string;
};

function AutoNodeTriggerProcessEditor(props: AutoNodeEditorProps) {
  const dispatch = useAppDispatch();
  const { node } = props;
  const [form] = Form.useForm<FormValuesType>();

  useValidateForm<FormValuesType>(form, node.id);

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      triggerConfig: node.triggerConfig,
      progress: node.progress,
    };
  }, [node]);

  const handleFormValuesChange = useMemoCallback(
    debounce(() => {
      dispatch(updateNode(Object.assign({}, node, form.getFieldsValue())));
    }, 300),
  );

  const nameRules: Rule[] = useMemo(() => {
    return [rules.name];
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={formInitialValues}
      onValuesChange={handleFormValuesChange}
      autoComplete="off"
    >
      <Form.Item label="节点名称" name="name" rules={nameRules} getValueFromEvent={trimInputValue} required>
        <Input size="large" placeholder="请输入节点名称" />
      </Form.Item>
      <Form.Item noStyle name={["triggerConfig", "isWait"]} valuePropName="checked">
        <Checkbox>流转等待</Checkbox>
      </Form.Item>
      <Form.Item noStyle>
        <div className={styles.tip}>被触发流程完成后，该流程才可进行流转</div>
      </Form.Item>
      <Form.Item noStyle name={["triggerConfig", "subapps"]}>
        <TriggerProcessConfig name={["triggerConfig", "subapps"]} />
      </Form.Item>
      <Form.Item name="progress">
        <MilestoneNodeConfig form={form} />
      </Form.Item>
    </Form>
  );
}

export default memo(AutoNodeTriggerProcessEditor);
