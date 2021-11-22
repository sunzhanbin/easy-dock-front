import { memo, useCallback, useMemo } from 'react';
import { Modal, Form, Select, message } from 'antd';
import { Icon } from '@common/components';
import DataApiConfig from '@/features/bpm-editor/components/data-api-config';
import ResponseWithMap from '@/features/bpm-editor/components/data-api-config/response-with-map';
import FormChange from './form-change';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { fieldRule, FormField, FormRuleItem } from '@/type';
import useMemoCallback from '@common/hooks/use-memo-callback';

type modalProps = {
  editIndex?: number;
  rule: FormRuleItem | null;
  type: 'add' | 'edit';
  onClose: () => void;
  onOk: (rules: any, type: 'add' | 'edit', editIndex?: number) => void;
};

const { Option } = Select;

const FormAttrModal = ({ editIndex, type, rule, onClose, onOk }: modalProps) => {
  const byId = useAppSelector(componentPropsSelector);
  const [form] = Form.useForm();
  // 表单中所有控件列表
  const componentList = useMemo(() => {
    return Object.values(byId).map((item: FormField) => item) || [];
  }, [byId]);
  const fields = useMemo<{ id: string; name: string }[]>(() => {
    return componentList
      .filter((com) => com.type !== 'DescText')
      .map((com) => ({ id: com.fieldName, name: com.label }));
  }, [componentList]);
  const initFormValues = useMemo(() => {
    // 添加规则
    if (!rule) {
      return { mode: 1, subtype: 1 };
    }
    if (rule.type === 'change') {
      // 编辑值改变时规则
      return {
        mode: 1,
        subtype: rule?.subtype || 1,
        ruleValue: rule.formChangeRule?.fieldRule,
        showComponents: rule.formChangeRule?.showComponents,
        hideComponents: rule.formChangeRule?.hideComponents,
        interfaceConfig: rule.formChangeRule?.interfaceConfig,
      };
    } else if (rule.type === 'init') {
      // 编辑进入表单时规则
      return {
        mode: 2,
        subtype: 1,
        dataConfig: rule.formInitRule,
      };
    }
  }, [rule]);

  const handelOk = useCallback(() => {
    form.validateFields().then((rules) => {
      const { hideComponents = [], showComponents = [], ruleValue = [], mode } = rules;
      if (mode === 1) {
        const fieldNameList = hideComponents.concat(showComponents);
        const nameList = ruleValue
          .filter((item: fieldRule[][][]) => item)
          .flat(3)
          .map((item: fieldRule) => item.fieldName);
        const intersection = fieldNameList.filter((val: string) => {
          return nameList.indexOf(val) > -1;
        });
        // 显示控件和隐藏控件中包含了条件中关联的控件
        if (intersection.length > 0) {
          message.error('条件关联的控件中包含了显示隐藏的控件');
          return;
        }
        onOk && onOk(rules, type, editIndex);
      } else {
        onOk && onOk(rules, type, editIndex);
      }
    });
  }, [form, type, editIndex, onOk]);
  const getPopupContainer = useMemo(() => {
    return (node: HTMLDivElement) => node;
  }, []);
  const handleChangeMode = useMemoCallback(() => {
    form.setFieldsValue({ subtype: 1 });
  });
  return (
    <Modal
      className={styles.modal}
      title="表单逻辑规则设置"
      visible={true}
      centered={true}
      onCancel={onClose}
      onOk={handelOk}
      width={660}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Form form={form} className={styles.form} layout="vertical" autoComplete="off" initialValues={initFormValues}>
        <Form.Item label="选择触发方式" name="mode" className={styles.mode}>
          <Select
            suffixIcon={<Icon type="xiala" />}
            size="large"
            getPopupContainer={getPopupContainer}
            onChange={handleChangeMode}
          >
            <Option key={1} value={1}>
              值改变时
            </Option>
            <Option key={2} value={2}>
              进入表单时
            </Option>
          </Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.mode !== curValues.mode}>
          {({ getFieldValue }) => {
            const mode = getFieldValue('mode');
            if (mode === 1) {
              return <FormChange />;
            }
            if (mode === 2) {
              return (
                <>
                  <Form.Item label="选择规则" name="subtype" className={styles.subtype}>
                    <Select suffixIcon={<Icon type="xiala" />} size="large" getPopupContainer={getPopupContainer}>
                      <Option key={1} value={1}>
                        读取数据
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="dataConfig" label="选择要读取数据的接口" className={styles.condition}>
                    <DataApiConfig
                      name="dataConfig"
                      label="为表单控件匹配请求参数"
                      layout="horizontal"
                      maxWidth="290px"
                      fields={fields}
                    >
                      <ResponseWithMap label="为表单控件匹配返回参数" />
                    </DataApiConfig>
                  </Form.Item>
                </>
              );
            }
            return null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(FormAttrModal);
