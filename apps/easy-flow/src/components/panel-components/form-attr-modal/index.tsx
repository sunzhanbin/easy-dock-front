import { memo, useState, useCallback, useMemo } from 'react';
import { Modal, Form, Select } from 'antd';
import { Icon } from '@common/components';
import Condition from '@/components/condition';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { FormField } from '@/type';

type modalProps = {
  onClose: () => void;
  onOk: () => void;
};

const { Option } = Select;

const FormAttrModal = ({ onClose, onOk }: modalProps) => {
  const byId = useAppSelector(componentPropsSelector);
  const [form] = Form.useForm();
  // 表单中所有控件列表
  const componentList = useMemo(() => {
    return (
      Object.values(byId)
        .filter((item: FormField) => (item.type as string) !== 'DescText')
        .map((item: FormField) => ({ label: item.label, id: item.id! })) || []
    );
  }, [byId]);

  const onChange = useCallback(() => {
    // console.info(form.getFieldsValue(), '111');
  }, [form]);
  return (
    <Modal className={styles.modal} title="添加表单逻辑规则" visible={true} onCancel={onClose} onOk={onOk}>
      <Form
        form={form}
        className={styles.form}
        layout="vertical"
        initialValues={{ mode: 1, ruleType: 1 }}
        onValuesChange={onChange}
      >
        <Form.Item label="选择触发方式" name="mode">
          <Select suffixIcon={<Icon type="xiala" />}>
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
                <Form.Item label="选择规则" name="ruleType">
                  <Select suffixIcon={<Icon type="xiala" />}>
                    <Option key={1} value={1}>
                      读取数据
                    </Option>
                  </Select>
                </Form.Item>
              );
            }
            return (
              <>
                <Form.Item label="选择规则" name="ruleType">
                  <Select suffixIcon={<Icon type="xiala" />}>
                    <Option key={1} value={1}>
                      显示隐藏规则
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item label="条件设置" name="ruleValue">
                  <Condition />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) => prevValues.ruleValue !== curValues.ruleValue}
                >
                  {({ getFieldValue }) => {
                    const ruleValue = getFieldValue('ruleValue');
                    // 规则中选中的组件id列表
                    const ruleComponentIdList =
                      (ruleValue && ruleValue.flat(1).map((item: { field: string }) => item.field)) || [];
                    // 显示控件的列表要排除规则中已有的组件列表
                    let options = [...componentList];
                    const set = new Set(ruleComponentIdList);
                    const selectIdList = Array.from(set);
                    selectIdList.forEach((id) => {
                      options = options.filter((option) => option.id !== id);
                    });
                    return (
                      <>
                        <Form.Item label="显示控件" name="showComponents">
                          <Select suffixIcon={<Icon type="xiala" />} mode="multiple" placeholder="请选择">
                            {options.map((option) => (
                              <Option key={option.id} value={option.id}>
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
                            console.info(showComponents, '111');
                            return (
                              <Form.Item label="隐藏控件" name="hideComponents">
                                <Select suffixIcon={<Icon type="xiala" />} mode="multiple" placeholder="请选择">
                                  {options.map((option) => (
                                    <Option key={option.id} value={option.id}>
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
