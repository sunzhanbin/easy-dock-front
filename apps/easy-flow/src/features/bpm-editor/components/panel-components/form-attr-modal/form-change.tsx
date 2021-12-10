import { memo, useCallback, useMemo } from 'react';
import { Form, Select } from 'antd';
import { Icon } from '@common/components';
import Condition from '@/features/bpm-editor/components/condition';
import DataApiConfig from '@/features/bpm-editor/components/data-api-config';
import ResponseWithMap from '@/features/bpm-editor/components/data-api-config/response-with-map';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { fieldRule, FormField, SelectField } from '@/type';
import { loadFieldDatasource } from '@utils/form';

const { Option } = Select;

const FormChange = () => {
  const byId = useAppSelector(componentPropsSelector);
  // 表单中所有控件列表
  const componentList = useMemo(() => {
    return Object.values(byId).map((item: FormField) => item) || [];
  }, [byId]);
  const getPopupContainer = useMemo(() => {
    return (node: HTMLDivElement) => node;
  }, []);
  // 加载选项数据源
  const loadDataSource = useCallback(
    (fieldName, parentId) => {
      if (parentId) {
        const parentComponent = componentList.find((v) => v.id === parentId) || {};
        const components = (parentComponent as any).components || (parentComponent as any).props.components;
        const component = components?.find((v: any) => v.config.fieldName === fieldName);
        const dataSource = component?.config?.dataSource;
        return loadFieldDatasource(dataSource);
      }
      const component = componentList.find((item) => item.fieldName === fieldName) || {};
      const { dataSource } = component as SelectField;
      return loadFieldDatasource(dataSource);
    },
    [componentList],
  );
  const fields = useMemo<{ id: string; name: string }[]>(() => {
    return componentList
      .filter((com) => !['DescText', 'Tabs'].includes(com.type))
      .map((com) => ({ id: com.fieldName, name: com.label }));
  }, [componentList]);
  return (
    <Form.Item noStyle shouldUpdate>
      <Form.Item label="选择规则" name="subtype" className={styles.subtype}>
        <Select suffixIcon={<Icon type="xiala" />} size="large" getPopupContainer={getPopupContainer}>
          <Option value={1}>显示隐藏规则</Option>
          <Option value={4}>接口调用规则</Option>
        </Select>
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const subtype = getFieldValue('subtype');
          if (subtype === 1) {
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
                      options.push(Object.assign({}, v.config, v.props, { label: `${item.label}·${v.config.label}` }));
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
                <Form.Item label="流转条件" name="ruleValue" className={styles.condition}>
                  <Condition
                    data={Object.values(byId)}
                    loadDataSource={loadDataSource}
                    name="ruleValue"
                    showTabs={true}
                  />
                </Form.Item>
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
                    const ruleComponentFieldIdList = ruleValue && ruleValue.flat(1).map((item) => item.fieldName);
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
          }
          if (subtype === 4) {
            return (
              <>
                <Form.Item label="流转条件" name="ruleValue" className={styles.condition}>
                  <Condition
                    data={Object.values(byId)}
                    showTabs={false}
                    loadDataSource={loadDataSource}
                    name="ruleValue"
                  />
                </Form.Item>
                <Form.Item name="interfaceConfig" label="选择接口" className={styles.condition}>
                  <DataApiConfig
                    name="interfaceConfig"
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
    </Form.Item>
  );
};

export default memo(FormChange);
