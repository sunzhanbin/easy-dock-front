import { memo, useMemo } from 'react';
import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import debounce from 'lodash/debounce';
import { useAppDispatch } from '@/app/hooks';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AuditNode } from '@type/flow';
import MemberSelector from '../components/member-selector';
import FieldAuths from '../components/field-auths';
import { updateNode } from '../../flow-slice';
import ButtonConfigs from './button-configs';
import { trimInputValue } from '../../util';
import useValidateForm from '../../hooks/use-validate-form';
import usePrevNodes from '../../hooks/use-prev-nodes';
import { rules } from '../../validators';

interface AuditNodeEditorProps {
  node: AuditNode;
}

type FormValuesType = {
  name: string;
  correlationMemberConfig: AuditNode['correlationMemberConfig'];
  btnConfigs: {
    btnText: AuditNode['btnText'];
    revert: AuditNode['revert'];
  };
  fieldsAuths: AuditNode['fieldsAuths'];
};

function AuditNodeEditor(props: AuditNodeEditorProps) {
  const dispatch = useAppDispatch();
  const { node } = props;
  const [form] = Form.useForm<FormValuesType>();
  const prevNodes = usePrevNodes(node.id);

  useValidateForm<FormValuesType>(form);

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      correlationMemberConfig: node.correlationMemberConfig,
      btnConfigs: {
        btnText: node.btnText,
        revert: node.revert,
      },
      fieldsAuths: node.fieldsAuths,
    };
  }, [node]);

  const handleFormValuesChange = useMemoCallback(
    debounce((_, allValues: FormValuesType) => {
      dispatch(
        updateNode({
          ...node,
          correlationMemberConfig: allValues.correlationMemberConfig,
          name: allValues.name,
          btnText: allValues.btnConfigs.btnText,
          revert: allValues.btnConfigs.revert,
          fieldsAuths: allValues.fieldsAuths,
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
      <Form.Item label="节点名称" name="name" rules={nameRules} getValueFromEvent={trimInputValue}>
        <Input size="large" placeholder="请输入用户节点名称" />
      </Form.Item>
      <Form.Item label="选择办理人" name="correlationMemberConfig" rules={memberRules} required>
        <MemberSelector />
      </Form.Item>
      <Form.Item label="操作权限" name="btnConfigs" required>
        <ButtonConfigs prevNodes={prevNodes} />
      </Form.Item>
      <Form.Item label="字段权限" name="fieldsAuths">
        <FieldAuths />
      </Form.Item>
    </Form>
  );
}

export default memo(AuditNodeEditor);
