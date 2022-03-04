import { memo, useMemo } from "react";
import { Form, Input, Button } from "antd";
import { Rule } from "antd/lib/form";
import debounce from "lodash/debounce";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { useAppDispatch } from "@/app/hooks";
import { FillNode } from "@type/flow";
import MemberSelector from "../../components/member-selector";
import { updateNode } from "../../flow-slice";
import ButtonEditor from "../../components/button-editor";
import FieldAuths from "../../components/field-auths";
import DueConfig from "@/features/bpm-editor/components/due-config";
import { trimInputValue } from "../../util";
import { rules } from "../../validators";
import useValidateForm from "../../hooks/use-validate-form";
import styles from "./index.module.scss";
import MilestoneNodeConfig from "@/features/bpm-editor/components/milestone-node-config";

interface FillNodeEditorProps {
  node: FillNode;
}

type FormValuesType = {
  name: string;
  correlationMemberConfig: FillNode["correlationMemberConfig"];
  btnText: FillNode["btnText"];
  fieldsAuths: FillNode["fieldsAuths"];
  progress: FillNode["progress"];
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

function FillNodeEditor(props: FillNodeEditorProps) {
  const dispatch = useAppDispatch();
  const { node } = props;
  const [form] = Form.useForm<FormValuesType>();

  useValidateForm<FormValuesType>(form, node.id);

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      correlationMemberConfig: node.correlationMemberConfig,
      btnText: node.btnText,
      fieldsAuths: node.fieldsAuths,
      progress: node.progress,
      dueConfig: node?.dueConfig || defaultDueConfig,
    };
  }, [node]);

  const handleFormValuesChange = useMemoCallback(
    debounce((_, allValues: FormValuesType) => {
      dispatch(updateNode(Object.assign({}, node, allValues)));
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
      <Form.Item label="节点名称" name="name" rules={nameRules} getValueFromEvent={trimInputValue} required>
        <Input size="large" placeholder="请输入用户节点名称" />
      </Form.Item>
      <Form.Item label="选择办理人" name="correlationMemberConfig" rules={memberRules} required>
        <MemberSelector />
      </Form.Item>
      <Form.Item className={styles["btn-configs"]} label="操作权限">
        <Form.Item name={["btnText", "save"]}>
          <ButtonEditor checkable={false} btnKey="save">
            <Button size="large">保存</Button>
          </ButtonEditor>
        </Form.Item>
        <Form.Item name={["btnText", "submit"]}>
          <ButtonEditor checkable={false} btnKey="submit">
            <Button size="large">提交</Button>
          </ButtonEditor>
        </Form.Item>
      </Form.Item>

      <Form.Item label="字段权限" name="fieldsAuths">
        <FieldAuths />
      </Form.Item>
      <Form.Item name="dueConfig">
        <DueConfig name="dueConfig" />
      </Form.Item>
      <MilestoneNodeConfig form={form} />
    </Form>
  );
}

export default memo(FillNodeEditor);
