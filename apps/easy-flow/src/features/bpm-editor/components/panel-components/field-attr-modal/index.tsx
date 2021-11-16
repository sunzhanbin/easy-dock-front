import { memo, useCallback, useMemo } from 'react';
import { Modal, Form } from 'antd';
import Condition from '@/features/bpm-editor/components/condition';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { PropertyRuleItem, FormField, SelectField } from '@/type';
import { loadFieldDatasource } from '@utils/form';

type modalProps = {
  editIndex?: number;
  rule: PropertyRuleItem | null;
  type: 'add' | 'edit';
  onClose: () => void;
  onOk: (rules: any, type: 'add' | 'edit', editIndex?: number) => void;
};

const FormAttrModal = ({ editIndex, type, rule, onClose, onOk }: modalProps) => {
  const byId = useAppSelector(componentPropsSelector);
  const [form] = Form.useForm();
  // 表单中所有控件列表
  const componentList = useMemo(() => {
    return Object.values(byId).map((item: FormField) => item) || [];
  }, [byId]);
  const initFormValues = useMemo(() => {
    // 添加规则
    if (!rule) {
      return {};
    }
    if (rule.type === 'change') {
      // 编辑值改变时规则
      return {
        ruleValue: rule.formChangeRule?.fieldRule,
      };
    }
  }, [rule]);
  // 加载选项数据源
  const loadDataSource = useCallback(
    (fieldName) => {
      const component = componentList.find((item) => item.fieldName === fieldName);
      const { dataSource } = component as SelectField;
      return loadFieldDatasource(dataSource);
    },
    [componentList],
  );

  const handelOk = useCallback(() => {
    form.validateFields().then((rules) => {
      onOk && onOk(rules, type, editIndex);
    });
  }, [form, type, editIndex, onOk]);
  return (
    <Modal
      className={styles.modal}
      title="规则设置"
      visible={true}
      centered={true}
      onCancel={onClose}
      onOk={handelOk}
      width={660}
      maskClosable={false}
    >
      <Form form={form} className={styles.form} layout="vertical" autoComplete="off" initialValues={initFormValues}>
        <Form.Item label="条件" name="ruleValue" className={styles.condition}>
          <Condition data={Object.values(byId)} loadDataSource={loadDataSource} name="ruleValue" isFormRule={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(FormAttrModal);
