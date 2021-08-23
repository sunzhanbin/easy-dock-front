import { memo, useMemo } from 'react';
import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import MemberSelector from '../components/member-selector';
import { updateNode } from '../../flow-slice';
import { CCNode, AuthType } from '@type/flow';
import FieldAuths from '../components/field-auths';
import { useAppDispatch } from '@/app/hooks';
import { trimInputValue } from '../../util';
import useValidateForm from '../../hooks/use-validate-form';
import { rules } from '../../validators';

interface CCNodeEditorProps {
  node: CCNode;
}

type FormValuesType = {
  name: string;
  correlationMemberConfig: CCNode['correlationMemberConfig'];
  fieldsAuths: CCNode['fieldsAuths'];
};

function CCNodeEditor(props: CCNodeEditorProps) {
  const dispatch = useAppDispatch();
  const { node } = props;
  const [form] = Form.useForm<FormValuesType>();

  useValidateForm<FormValuesType>(form);

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      correlationMemberConfig: node.correlationMemberConfig,
      fieldsAuths: node.fieldsAuths,
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
        <Input size="large" placeholder="请输入抄送节点名称" />
      </Form.Item>
      <Form.Item label="选择办理人" name="correlationMemberConfig" rules={memberRules}>
        <MemberSelector />
      </Form.Item>
      <Form.Item label="字段权限" name="fieldsAuths">
        <FieldAuths max={AuthType.View} />
      </Form.Item>
    </Form>
  );
}

export default memo(CCNodeEditor);
