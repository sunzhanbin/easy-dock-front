import { memo, useMemo } from 'react';
import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AutoNode } from '@type/flow';
import { useAppDispatch } from '@/app/hooks';
import { updateNode } from '../../flow-slice';
import { trimInputValue } from '../../util';
import { rules } from '../../validators';
import useValidateForm from '../../hooks/use-validate-form';
import DataApiConfig from '../../../components/data-api-config';
import useFieldsTemplate from '../../hooks/use-fields-template';

interface AutoNodeEditorProps {
  node: AutoNode;
}

type FormValuesType = {
  name: string;
};

function AutoNodeEditor(props: AutoNodeEditorProps) {
  const dispatch = useAppDispatch();
  const { node } = props;
  const fieldsTemplate = useFieldsTemplate();
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

  const fields = useMemo(() => {
    return fieldsTemplate.filter((item) => item.type !== 'DescText').map((item) => ({ name: item.name, id: item.id }));
  }, [fieldsTemplate]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={formInitialValues}
      onValuesChange={handleFormValuesChange}
      autoComplete="off"
    >
      <Form.Item label="节点名称" name="name" rules={nameRules} getValueFromEvent={trimInputValue} required>
        <Input size="large" placeholder="请输入抄送节点名称" />
      </Form.Item>
      <Form.Item name="dataConfig" label="选择要推送数据的接口" required>
        <DataApiConfig name="dataConfig" label="选择接口的推送参数" fields={fields} />
      </Form.Item>
    </Form>
  );
}

export default memo(AutoNodeEditor);
