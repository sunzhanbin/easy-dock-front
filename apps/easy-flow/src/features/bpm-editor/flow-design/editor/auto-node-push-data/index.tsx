import { memo, useMemo } from "react";
import { Form, Input } from "antd";
import { Rule } from "antd/lib/form";
import debounce from "lodash/debounce";
import useMemoCallback from "@common/hooks/use-memo-callback";
import ResponseWithMap from "@/features/bpm-editor/components/data-api-config/response-with-map";
import NodeFloeConfig from "@/features/bpm-editor/components/node-flow-config";
import { AutoNodePushData, NextAction } from "@type/flow";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { formMetaSelector, updateNode } from "../../flow-slice";
import { trimInputValue } from "../../util";
import { rules } from "../../validators";
import useValidateForm from "../../hooks/use-validate-form";
import DataApiConfig from "../../../components/data-api-config";
import MilestoneNodeConfig from "@/features/bpm-editor/components/milestone-node-config";

interface AutoNodeEditorProps {
  node: AutoNodePushData;
}

type FormValuesType = {
  name: string;
};

const initialNextAction: NextAction = {
  type: 1,
  conditions: [],
  failConfig: {
    type: 1,
    revert: {
      type: 1,
    },
  },
};

function AutoNodeEditor(props: AutoNodeEditorProps) {
  const dispatch = useAppDispatch();
  const { node } = props;
  const formMeta = useAppSelector(formMetaSelector);
  const [form] = Form.useForm<FormValuesType>();

  useValidateForm<FormValuesType>(form, node.id);

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      dataConfig: node.dataConfig,
      nextAction: node?.nextAction || initialNextAction,
      progress: node.progress,
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

  const fields = useMemo(() => {
    return (formMeta?.components || [])
      .filter((item) => !["DescText", "Tabs"].includes(item.config.type))
      .map((item) => ({ name: item.config.label as string, id: item.config.fieldName }));
  }, [formMeta]);

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
      <Form.Item name="dataConfig" label="选择要推送数据的接口" required>
        <DataApiConfig name="dataConfig" label="推送参数" maxWidth="320px" fields={fields}>
          <ResponseWithMap label="返回参数" />
        </DataApiConfig>
      </Form.Item>
      <Form.Item name="nextAction" label="节点流转设置">
        <NodeFloeConfig name="nextAction" nodeId={node.id} />
      </Form.Item>
      <Form.Item name="progress">
        <MilestoneNodeConfig form={form} />
      </Form.Item>
    </Form>
  );
}

export default memo(AutoNodeEditor);
