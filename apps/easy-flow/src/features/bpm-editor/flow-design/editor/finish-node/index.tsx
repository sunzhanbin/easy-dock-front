import { memo, useMemo } from 'react';
import { Input, Form } from 'antd';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { FinishNode } from '@type/flow';
import { useAppDispatch } from '@/app/hooks';
import { rules } from '../../validators';
import { updateNode } from '../../flow-slice';
import { trimInputValue } from '../../util';
import useValidateForm from '../../hooks/use-validate-form';

interface FinishNodeEditorProps {
  node: FinishNode;
}

type FormValuesType = { name: string };

function FinishNodeEditor(props: FinishNodeEditorProps) {
  const { node } = props;
  const [form] = Form.useForm<FormValuesType>();
  const dispatch = useAppDispatch();
  const handleFormValuesChange = useMemoCallback(
    debounce((_, allValues: { name: string }) => {
      console.log(allValues);

      dispatch(
        updateNode({
          ...node,
          name: allValues.name,
        }),
      );
    }, 100),
  );

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
    };
  }, [node]);

  useValidateForm<FormValuesType>(form);

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={formInitialValues}
      onValuesChange={handleFormValuesChange}
    >
      <Form.Item label="节点名称" name="name" getValueFromEvent={trimInputValue} rules={[rules.name]} required>
        <Input size="large" placeholder="请输入开始节点名称" />
      </Form.Item>
    </Form>
  );
}

export default memo(FinishNodeEditor);
