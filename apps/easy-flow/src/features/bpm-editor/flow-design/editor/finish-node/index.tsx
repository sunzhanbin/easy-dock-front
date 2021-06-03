import { memo, useMemo } from 'react';
import { Input, Form } from 'antd';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { updateNode } from '../../flow-slice';
import { FinishNode } from '@type/flow';
import { useAppDispatch } from '@/app/hooks';
import { trimInputValue } from '../../util';

interface FinishNodeEditorProps {
  node: FinishNode;
}

function FinishNodeEditor(props: FinishNodeEditorProps) {
  const { node } = props;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const handleFormValuesChange = useMemoCallback(
    debounce((_, allValues: { name: string }) => {
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

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={formInitialValues}
      onValuesChange={handleFormValuesChange}
    >
      <Form.Item label="节点名称" name="name" getValueFromEvent={trimInputValue}>
        <Input size="large" placeholder="请输入开始节点名称" />
      </Form.Item>
    </Form>
  );
}

export default memo(FinishNodeEditor);
