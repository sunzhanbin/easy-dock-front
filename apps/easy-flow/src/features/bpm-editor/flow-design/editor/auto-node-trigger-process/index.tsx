import { memo, useMemo } from 'react';
import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AutoNodeTriggerProcess, TriggerConfig } from '@type/flow';
import { useAppDispatch } from '@/app/hooks';
import { updateNode } from '../../flow-slice';
import { trimInputValue } from '../../util';
import { rules } from '../../validators';
import useValidateForm from '../../hooks/use-validate-form';
import TriggerProcessConfig from '../../../components/trigger-process-config';

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
      <Form.Item noStyle name="triggerConfig">
        <TriggerProcessConfig name="triggerConfig" />
      </Form.Item>
    </Form>
  );
}

export default memo(AutoNodeTriggerProcessEditor);
