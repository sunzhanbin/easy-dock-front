import { memo, useMemo, useEffect } from 'react';
import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import MemberSelector from '../components/member-selector';
import { updateNode, flowDataSelector } from '../../flow-slice';
import { AuditNode, AllNode } from '@type/flow';
import ButtonConfigs from './button-configs';
import FieldAuths from '../components/field-auths';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { trimInputValue } from '../../util';
import useValidateForm from '../use-validate-form';
import { name } from '../rules';

interface AuditNodeEditorProps {
  node: AuditNode;
  prevNodes: AllNode[];
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
  const { node, prevNodes } = props;
  const { fieldsTemplate } = useAppSelector(flowDataSelector);
  const [form] = Form.useForm<FormValuesType>();

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
    return [name];
  }, []);

  const memberRules: Rule[] = useMemo(() => {
    return [
      {
        required: true,
        validator(_, value: FormValuesType['correlationMemberConfig']) {
          const { members = [] } = value;

          if (!members.length) {
            return Promise.reject(new Error('办理人不能为空'));
          }

          return Promise.resolve();
        },
      },
    ];
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
      <Form.Item label="选择办理人" name="correlationMemberConfig" rules={memberRules}>
        <MemberSelector />
      </Form.Item>
      <Form.Item label="操作权限" name="btnConfigs" required>
        <ButtonConfigs prevNodes={prevNodes} />
      </Form.Item>
      <Form.Item label="字段权限" name="fieldsAuths">
        <FieldAuths templates={fieldsTemplate} />
      </Form.Item>
    </Form>
  );
}

export default memo(AuditNodeEditor);
