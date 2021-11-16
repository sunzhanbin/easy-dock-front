import { memo, useCallback, useMemo } from 'react';
import { Modal, Form } from 'antd';
import Condition from '@/features/bpm-editor/components/condition';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { PropertyRuleItem, FormField } from '@/type';

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
    const list = Object.values(byId).map((item: FormField) => item) || [];
    return list.filter((com) => com.type === 'Date');
  }, [byId]);
  console.log(componentList, 'comp');
  const initFormValues = useMemo(() => {
    // 添加规则
    if (!rule) {
      return {};
    }
    if (rule.type === 'change') {
      // 编辑值改变时规则
      return {
        propertyValue: rule.formChangeRule?.fieldRule,
      };
    }
  }, [rule]);

  const handleOk = useCallback(async () => {
    form.validateFields().then((rules) => {
      onOk && onOk(rules, type, editIndex);
    });
  }, [form, type, editIndex, onOk]);
  return (
    <Modal
      className={styles.modal}
      title="表单静态规则设置"
      visible={true}
      centered={true}
      onCancel={onClose}
      onOk={handleOk}
      width={660}
      maskClosable={false}
    >
      <Form form={form} className={styles.form} layout="vertical" autoComplete="off" initialValues={initFormValues}>
        <Form.Item label="规则设置" name="propertyValue" className={styles.condition}>
          <Condition data={componentList} name="propertyValue" isFormRule={false} showTabs={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(FormAttrModal);
