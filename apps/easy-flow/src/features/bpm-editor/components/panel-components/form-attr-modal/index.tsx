import { memo, useCallback, useMemo } from 'react';
import { Modal, Form, Select, message } from 'antd';
import { Icon } from '@common/components';
import Condition from '@/features/bpm-editor/components/condition';
import DataApiConfig from '@/features/bpm-editor/components/data-api-config';
import ResponseWithMap from '@/features/bpm-editor/components/data-api-config/response-with-map';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { fieldRule, FormField, FormRuleItem, SelectField } from '@/type';
import { loadFieldDatasource } from '@utils/form';

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
      return { mode: 1, ruleType: 1 };
    }
    if (rule.type === 'change') {
      // 编辑值改变时规则
      return {
        mode: 1,
        ruleType: 1,
        ruleValue: rule.formChangeRule?.fieldRule,
        showComponents: rule.formChangeRule?.showComponents,
        hideComponents: rule.formChangeRule?.hideComponents,
      };
    } else if (rule.type === 'init') {
      // 编辑进入表单时规则
      return {
        mode: 2,
        ruleType: 1,
        dataConfig: rule.formInitRule,
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
  return (
    <Modal
      className={styles.modal}
      title="表单逻辑规则设置"
      visible={true}
      centered={true}
      onCancel={onClose}
      onOk={handelOk}
      width={660}
      maskClosable={false}
    >
      <Form form={form} className={styles.form} layout="vertical" autoComplete="off" initialValues={initFormValues}>
        <Form.Item label="选择触发方式" name="mode" className={styles.mode}>
          <Select suffixIcon={<Icon type="xiala" />} size="large" getPopupContainer={getPopupContainer}>
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
                <>
                  <Form.Item label="选择规则" name="ruleType" className={styles.ruleType}>
                    <Select suffixIcon={<Icon type="xiala" />} size="large" getPopupContainer={getPopupContainer}>
                      <Option key={1} value={1}>
                        读取数据
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="dataConfig" label="选择要读取数据的接口" className={styles.condition}>
                    <DataApiConfig name="dataConfig" label="为表单控件匹配请求参数" layout="horizontal" fields={fields}>
                      <ResponseWithMap label="为表单控件匹配返回参数" />
                    </DataApiConfig>
                  </Form.Item>
                </>
              );
            }
            return (
              <>
                <Form.Item label="选择规则" name="ruleType" className={styles.ruleType}>
                  <Select suffixIcon={<Icon type="xiala" />} size="large" getPopupContainer={getPopupContainer}>
                    <Option key={1} value={1}>
                      显示隐藏规则
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item label="流转条件" name="ruleValue" className={styles.condition}>
                  <Condition data={Object.values(byId)} loadDataSource={loadDataSource} name="ruleValue" />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.ruleValue !== curValues.ruleValue ||
                    prevValues.hideComponents !== curValues.hideComponents
                  }
                >
                  {({ getFieldValue }) => {
                    const ruleValue: fieldRule[] = getFieldValue('ruleValue') || [];
                    const hideComponents = getFieldValue('hideComponents') || [];
                    // 规则中选中的组件fieldName列表
                    const ruleComponentFieldIdList = ruleValue.flat(1).map((item) => item.fieldName);
                    // 显示控件的列表要排除规则中已有的组件列表和已选择的隐藏控件
                    let options: any[] = [];
                    if (ruleComponentFieldIdList.length > 0) {
                      const parentId = ruleValue.flat(1)[0].parentId;
                      const set = new Set(ruleComponentFieldIdList.concat(hideComponents));
                      const selectFieldIdList = Array.from(set);
                      const components = [...componentList];
                      // 选择了tabs内的控件,则控制的控件也是tabs内的控件
                      if (parentId) {
                        components.forEach((item) => {
                          if (item.type === 'Tabs') {
                            item.components?.forEach((v) => {
                              options.push(
                                Object.assign({}, v.config, v.props, { label: `${item.label}·${v.config.label}` }),
                              );
                            });
                          }
                        });
                      } else {
                        // 选择的是tabs外的控件，则控制的也是tabs外的控件
                        components
                          .filter((item) => item.type !== 'Tabs')
                          .forEach((v) => {
                            options.push(v);
                          });
                      }
                      selectFieldIdList.forEach((fieldName) => {
                        options = options.filter((option) => option.fieldName !== fieldName);
                      });
                    } else {
                      // 条件组件中没有选中条件,不允许选择显示或隐藏的控件
                      options = [];
                    }
                    return (
                      <>
                        <Form.Item label="显示控件" name="showComponents" className={styles.showComponents}>
                          <Select
                            suffixIcon={<Icon type="xiala" />}
                            mode="multiple"
                            placeholder="请选择"
                            size="large"
                            virtual={false}
                            getPopupContainer={getPopupContainer}
                          >
                            {options.map((option) => (
                              <Option key={option.fieldName} value={option.fieldName}>
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
                            const ruleValue: fieldRule[] = getFieldValue('ruleValue') || [];
                            // 规则中选中的组件fieldName列表
                            const ruleComponentFieldIdList =
                              ruleValue && ruleValue.flat(1).map((item) => item.fieldName);
                            // 显示控件的列表要排除规则中已有的组件列表和已选择的隐藏控件
                            let options: any[] = [];
                            if (ruleComponentFieldIdList.length > 0) {
                              const parentId = ruleValue.flat(1)[0].parentId;
                              const set = new Set(ruleComponentFieldIdList.concat(showComponents));
                              const selectFieldIdList = Array.from(set);
                              const components = [...componentList];
                              // 选择了tabs内的控件,则控制的控件也是tabs内的控件
                              if (parentId) {
                                components.forEach((item) => {
                                  if (item.type === 'Tabs') {
                                    item.components?.forEach((v) => {
                                      options.push(
                                        Object.assign({}, v.config, v.props, {
                                          label: `${item.label}·${v.config.label}`,
                                        }),
                                      );
                                    });
                                  }
                                });
                              } else {
                                // 选择的是tabs外的控件，则控制的也是tabs外的控件
                                components
                                  .filter((item) => item.type !== 'Tabs')
                                  .forEach((v) => {
                                    options.push(v);
                                  });
                              }
                              selectFieldIdList.forEach((fieldName) => {
                                options = options.filter((option) => option.fieldName !== fieldName);
                              });
                            } else {
                              // 条件组件中没有选中条件,不允许选择显示或隐藏的控件
                              options = [];
                            }
                            return (
                              <Form.Item label="隐藏控件" name="hideComponents" className={styles.hideComponents}>
                                <Select
                                  suffixIcon={<Icon type="xiala" />}
                                  mode="multiple"
                                  placeholder="请选择"
                                  size="large"
                                  virtual={false}
                                  getPopupContainer={getPopupContainer}
                                >
                                  {options.map((option) => (
                                    <Option key={option.fieldName} value={option.fieldName}>
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
