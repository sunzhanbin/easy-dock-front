import { memo, useCallback, useMemo } from 'react';
import { Modal, Form, Select } from 'antd';
import { Icon } from '@common/components';
import Condition from '@/features/bpm-editor/components/condition';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { FormField, FormRuleItem } from '@/type';
import { runtimeAxios } from '@/utils/axios';

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
  const initFormValues = useMemo(() => {
    // 添加规则
    if (!rule) {
      return { mode: 1, ruleType: 1 };
    }
    // 编辑值改变时规则
    if (rule.type === 'change') {
      return {
        mode: 1,
        ruleType: 1,
        ruleValue: rule.formChangeRule?.filedRule,
        showComponents: rule.formChangeRule?.showComponents,
        hideComponents: rule.formChangeRule?.hideComponents,
      };
    }
    // TODO 编辑进入表单时规则
  }, [rule]);
  // 加载选项数据源
  const loadDataSource = useCallback(
    (fieldId) => {
      const component = componentList.find((item) => item.id === fieldId);
      const { dataSource } = component as any;
      if (!dataSource) {
        return Promise.resolve(null);
      }
      if (dataSource.type === 'custom') {
        //自定义数据
        return Promise.resolve(dataSource.data);
      } else if (dataSource.type === 'subapp') {
        //其他表单数据
        const { fieldName = '', subappId = '' } = dataSource;
        if (fieldName && subappId) {
          return runtimeAxios.get(`/subapp/${subappId}/form/${fieldName}/data`).then((res) => {
            const list = (res.data?.data || []).map((val: string) => ({ key: val, value: val }));
            return Promise.resolve(list);
          });
        }
        return Promise.resolve([]);
      }
      return Promise.resolve(null);
    },
    [componentList],
  );

  const handelOk = useCallback(() => {
    form.validateFields().then((rules) => {
      onOk && onOk(rules, type, editIndex);
    });
  }, [form, type, editIndex, onOk]);
  return (
    <Modal className={styles.modal} title="表单逻辑规则设置" visible={true} onCancel={onClose} onOk={handelOk}>
      <Form form={form} className={styles.form} layout="vertical" initialValues={initFormValues}>
        <Form.Item label="选择触发方式" name="mode" className={styles.mode}>
          <Select suffixIcon={<Icon type="xiala" />} size="large">
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
            if (mode === 2) {
              return (
                <Form.Item label="选择规则" name="ruleType" className={styles.ruleType}>
                  <Select suffixIcon={<Icon type="xiala" />} size="large">
                    <Option key={1} value={1}>
                      读取数据
                    </Option>
                  </Select>
                </Form.Item>
              );
            }
            return (
              <>
                <Form.Item label="选择规则" name="ruleType" className={styles.ruleType}>
                  <Select suffixIcon={<Icon type="xiala" />} size="large">
                    <Option key={1} value={1}>
                      显示隐藏规则
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item label="流转条件" name="ruleValue" className={styles.condition}>
                  <Condition data={Object.values(byId)} loadDataSource={loadDataSource} />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.ruleValue !== curValues.ruleValue ||
                    prevValues.hideComponents !== curValues.hideComponents
                  }
                >
                  {({ getFieldValue }) => {
                    const ruleValue = getFieldValue('ruleValue') || [];
                    const hideComponents = getFieldValue('hideComponents') || [];
                    // 规则中选中的组件id列表
                    const ruleComponentIdList = ruleValue.flat(1).map((item: { fieldId: string }) => item.fieldId);
                    const set = new Set(ruleComponentIdList.concat(hideComponents));
                    const selectIdList = Array.from(set);
                    // 显示控件的列表要排除规则中已有的组件列表和已选择的隐藏控件
                    let options = [...componentList];
                    selectIdList.forEach((id) => {
                      options = options.filter((option) => option.id !== id);
                    });
                    return (
                      <>
                        <Form.Item label="显示控件" name="showComponents" className={styles.showComponents}>
                          <Select suffixIcon={<Icon type="xiala" />} mode="multiple" placeholder="请选择" size="large">
                            {options.map((option) => (
                              <Option key={option.id} value={option.id!}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.showComponents !== curValues.showComponents ||
                            prevValues.ruleValue !== curValues.ruleValue
                          }
                        >
                          {({ getFieldValue }) => {
                            const showComponents = getFieldValue('showComponents') || [];
                            const ruleValue = getFieldValue('ruleValue') || [];
                            // 规则中选中的组件id列表
                            const ruleComponentIdList =
                              ruleValue && ruleValue.flat(1).map((item: { fieldId: string }) => item.fieldId);
                            const set = new Set(ruleComponentIdList.concat(showComponents));
                            const selectIdList = Array.from(set);
                            // 隐藏控件的列表要排除规则中已有的组件列表和已选择的显示控件
                            let options = [...componentList];
                            selectIdList.forEach((id) => {
                              options = options.filter((option) => option.id !== id);
                            });
                            return (
                              <Form.Item label="隐藏控件" name="hideComponents" className={styles.hideComponents}>
                                <Select
                                  suffixIcon={<Icon type="xiala" />}
                                  mode="multiple"
                                  placeholder="请选择"
                                  size="large"
                                >
                                  {options.map((option) => (
                                    <Option key={option.id} value={option.id!}>
                                      {option.label}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(FormAttrModal);
