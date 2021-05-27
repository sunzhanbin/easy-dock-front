import { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';
import debounce from 'lodash/debounce';
import MemberSelector from '@components/member-selector';
import { Rule } from 'antd/lib/form';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { updateNode, flowDataSelector } from '../../flow-slice';
import { AuditNode, AllNode } from '../../types';
import ButtonConfigs from './button-configs';
import FieldAuths from '../components/field-auths';
import styles from './index.module.scss';

interface UserNodeEditorProps {
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

function UserNodeEditor(props: UserNodeEditorProps) {
  const dispatch = useDispatch();
  const { node, prevNodes } = props;
  const { fieldsTemplate } = useSelector(flowDataSelector);
  const [form] = Form.useForm<FormValuesType>();
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
    return [
      {
        required: true,
        validator(_, value: string) {
          if (!value || value.length > 30 || /[^\u4e00-\u9fa5_\d\w]/.test(value)) {
            return Promise.reject(new Error('节点名称为1-30位汉字、字母、数字、下划线'));
          } else {
            return Promise.resolve();
          }
        },
      },
    ];
  }, []);

  const memberRules: Rule[] = useMemo(() => {
    return [
      {
        required: true,
        validator(_, value: FormValuesType['correlationMemberConfig']) {
          const { departs = [], members = [] } = value;

          if (!departs.length && !members.length) {
            return Promise.reject(new Error('办理人不能为空'));
          }

          return Promise.resolve();
        },
      },
    ];
  }, []);

  const buttonRules: Rule[] = useMemo(() => {
    return [
      {
        required: true,
        validator(_, value: FormValuesType['btnConfigs']) {
          const { btnText, revert } = value;

          if (!btnText) {
            return Promise.reject(new Error('按钮配置不能为空'));
          }

          if (btnText.revert?.enable && !revert) {
            return Promise.reject(new Error('驳回节点不能为空'));
          }

          let key: keyof typeof btnText;
          let invalid = true;

          for (key in btnText) {
            if (btnText[key]?.enable) {
              invalid = false;
              break;
            }
          }

          if (invalid) {
            return Promise.reject(new Error('按钮配置不能为空'));
          }

          return Promise.resolve();
        },
      },
    ];
  }, []);

  return (
    <Form
      className={styles.form}
      form={form}
      layout="vertical"
      initialValues={formInitialValues}
      onValuesChange={handleFormValuesChange}
      autoComplete="off"
    >
      <Form.Item label="节点名称" name="name" rules={nameRules}>
        <Input size="large" placeholder="请输入用户节点名称" />
      </Form.Item>
      <Form.Item label="选择办理人" name="correlationMemberConfig" rules={memberRules}>
        <MemberSelector />
      </Form.Item>
      <Form.Item label="操作权限" name="btnConfigs" rules={buttonRules}>
        <ButtonConfigs prevNodes={prevNodes} />
      </Form.Item>
      <Form.Item label="字段权限" name="fieldsAuths">
        <FieldAuths templates={fieldsTemplate} />
      </Form.Item>
    </Form>
  );
}

export default memo(UserNodeEditor);
