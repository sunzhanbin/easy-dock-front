import { memo, useMemo } from "react";
import { Form, Input } from "antd";
import { Rule } from "antd/lib/form";
import debounce from "lodash/debounce";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { PluginNode } from "@type/flow";
import { useAppDispatch } from "@/app/hooks";
import PluginDataConfig from "@/features/bpm-editor/components/plugin-data-config";
import { updateNode } from "../../flow-slice";
import { trimInputValue } from "../../util";
import { rules } from "../../validators";
import useValidateForm from "../../hooks/use-validate-form";

type FormValuesType = {
  name: string;
};

function AutoNodeEditor(props: { node: PluginNode }) {
  const dispatch = useAppDispatch();
  const { node } = props;
  const [form] = Form.useForm<FormValuesType>();

  useValidateForm<FormValuesType>(form, node.id);

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      dataConfig: node.dataConfig,
    };
  }, [node]);

  const handleFormValuesChange = useMemoCallback(
    debounce((_, allValues: FormValuesType) => {
      dispatch(updateNode(Object.assign({}, node, allValues)));
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
      <Form.Item name="dataConfig">
        <PluginDataConfig name="dataConfig" />
      </Form.Item>
    </Form>
  );
}

export default memo(AutoNodeEditor);
