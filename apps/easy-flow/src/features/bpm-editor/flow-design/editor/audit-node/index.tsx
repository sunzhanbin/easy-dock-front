import { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Checkbox, InputNumber } from 'antd';
import { Rule } from 'antd/lib/form';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AuditNode } from '@type/flow';
import MemberSelector from '../../components/member-selector';
import FieldAuths from '../../components/field-auths';
import ButtonConfigs from './button-configs';
// import CounterSignButtonGroup from './countersign-btn-group';
import { updateNode } from '../../flow-slice';
import { trimInputValue } from '../../util';
import useValidateForm from '../../hooks/use-validate-form';
import usePrevNodes from '../../hooks/use-prev-nodes';
import { rules } from '../../validators';
// import styles from './index.module.scss';

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
  countersign: AuditNode['countersign'];
};

function AuditNodeEditor(props: AuditNodeEditorProps) {
  const dispatch = useDispatch();
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
      countersign: node.countersign,
    };
  }, [node]);

  const handleFormValuesChange = useMemoCallback(
    debounce(() => {
      const allValues = form.getFieldsValue(true);

      dispatch(
        updateNode({
          ...node,
          correlationMemberConfig: allValues.correlationMemberConfig,
          name: allValues.name,
          btnText: allValues.btnConfigs.btnText,
          revert: allValues.btnConfigs.revert,
          fieldsAuths: allValues.fieldsAuths,
          countersign: allValues.countersign,
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
      {/* 会签915之后打开 */}
      {/* <Form.Item>
        <Form.Item
          name={['countersign', 'enable']}
          label="会签设置"
          className={styles['countersign-checkbox__wrapper']}
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {(form) => {
            const { enable, type } = form.getFieldValue(['countersign']) || {};

            if (!enable) return null;

            return (
              <>
                <Form.Item
                  className={styles['countersign-type__wrapper']}
                  name={['countersign', 'type']}
                  initialValue={type === undefined ? 1 : undefined}
                >
                  <CounterSignButtonGroup />
                </Form.Item>

                {type === 1 ? (
                  <div className={styles['countersign-detail']}>
                    <Form.Item name={['countersign', 'percent']}>
                      <InputNumber size="large" min={0} max={100} placeholder="请输入" />
                    </Form.Item>
                    <span>% 同意时进入下一节点，否则驳回</span>
                  </div>
                ) : (
                  <div className={styles['countersign-detail']}>
                    <Form.Item name={['countersign', 'count']}>
                      <InputNumber size="large" min={0} precision={0} placeholder="请输入" />
                    </Form.Item>
                    <span>人同意时进入下一节点，否则驳回</span>
                  </div>
                )}
              </>
            );
          }}
        </Form.Item>
      </Form.Item> */}
      <Form.Item label="字段权限" name="fieldsAuths">
        <FieldAuths />
      </Form.Item>
    </Form>
  );
}

export default memo(AuditNodeEditor);
