import React, {memo, useEffect, useMemo, useState} from 'react';
import {Col, Form, FormInstance, Row} from 'antd';
import classNames from 'classnames';
import {Rule} from 'antd/lib/form';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useLoadComponents from '@/hooks/use-load-components';
import {AllComponentType, Datasource, fieldRule, FormChangeRule} from '@type';
import {AuthType, FieldAuthsMap} from '@type/flow';
import {FormMeta, FormValue} from '@type/detail';
import {analysisFormChangeRule, runtimeAxios} from '@/utils';
import LabelContent from '../label-content';
import styles from './index.module.scss';
import {Loading} from '@common/components';
import {DataConfig, ParamSchem} from '@/type/api';
import FormContainer from './form-container'
import _ from 'lodash';
import {getFlowData} from "@apis/detail";

type FieldsVisible = { [fieldId: string]: boolean };

interface FormProps {
  data: FormMeta;
  fieldsAuths: FieldAuthsMap;
  initialValue: { [key: string]: any };
  readonly?: boolean;
  className?: string;
  projectId?: number;
  datasource: Datasource;
}

type CompMaps = {
  [componentId: string]: FormMeta['components'][number];
};

export type ConfigMap = {
  [key: string]: {
    [key: string]: any
    name?: string
    tableData?: { [key: string]: any }[]
  }
}

const FormDetail = React.forwardRef(function FormDetail(
  props: FormProps,
  ref: React.ForwardedRef<FormInstance<FormValue>>,
) {
  const {data, fieldsAuths, datasource, initialValue, readonly, className, projectId} = props;
  const [form] = Form.useForm<FormValue>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldsVisible, setFieldsVisible] = useState<FieldsVisible>({});
  const [compMaps, setCompMaps] = useState<CompMaps>({});
  const [showForm, setShowForm] = useState(false);
  const [configMap, setConfigMap] = useState<ConfigMap>({})

  const changeRuleList = useMemo<(FormChangeRule & { hasChanged: boolean })[]>(() => {
    if (!data.formRules) {
      return [];
    }
    return data.formRules
      .filter((rule) => rule.type === 'change')
      .map((rule) => rule.formChangeRule)
      .map((rule) => Object.assign({}, rule, {hasChanged: false}));
  }, [data.formRules]);
  const initRuleList = useMemo<DataConfig[]>(() => {
    if (!data.formRules) {
      return [];
    }
    return data.formRules.filter((rule) => rule.type === 'init').map((rule) => rule.formInitRule as DataConfig);
  }, [data.formRules]);
  const changeFieldRuleList = useMemo(() => {
    if (!data.fieldRules) {
      return [];
    }
    return data.fieldRules.map((rule) => rule.formChangeRule);
  }, [data]);
  // 缓存之前的表单控件显隐状态
  const cacheFieldsVisibleMap = useMemo(() => {
    const map: { [k: number]: FieldsVisible } = {};
    changeRuleList.forEach((rule, index) => {
      map[index] = {};
    });
    return map;
  }, [changeRuleList]);

  // 提取所有组件类型
  const componentTypes = useMemo(() => {
    return data.components.map((comp) => comp.config.type);
  }, [data]);
  // 获取组件源码
  const compSources = useLoadComponents(componentTypes);
  // 收集单个规则的控件依赖
  const collectFieldNameList = useMemoCallback((rule: fieldRule[][]) => {
    const list = rule
      .filter((v) => v)
      .flat(2)
      .map((rule) => rule.fieldName as string);
    const set = new Set(list);
    return Array.from(set);
  });
  const collectFieldList = useMemoCallback((rule: fieldRule[][]) => {
    const list = rule.filter((v) => v).flat(2);
    const set = new Set(list);
    return Array.from(set);
  });
  const formValuesChange = useMemoCallback(async (changedValues: FormValue) => {
    // 处理单个控件绑定的事件
    if (data.events && data.events.onchange) {
      // 处理响应表单事件，响应绑定的visible和reset
      data.events.onchange.forEach((event) => {
        const {fieldId, listeners, value} = event;
        const {visible, reset} = listeners;
        // 处理visible
        if (fieldId in changedValues && visible && visible.length) {
          const fieldsVisible: FieldsVisible = {};
          visible.forEach((id) => {
            fieldsVisible[id] = changedValues[fieldId] === value;
          });
          setFieldsVisible((oldVisible) => Object.assign({}, oldVisible, fieldsVisible));
        }
        // 处理reset
        if (changedValues[fieldId] === value) {
          if (reset && reset.length) {
            const fiieldsResetValues: { [key: string]: undefined } = {};
            reset.forEach((id) => {
              fiieldsResetValues[id] = undefined;
            });
            form.setFieldsValue(fiieldsResetValues);
          }
        }
      });
    }
    const formValues = form.getFieldsValue();
    const changedFieldName = Object.keys(changedValues).length > 0 ? Object.keys(changedValues)[0] : '';
    const fieldChangedValue = Object.values(changedValues).length > 0 ? Object.values(changedValues)[0] : '';
    // 处理表单属性值改变时事件
    // console.log(formValues, changedValues, compMaps, 'filedName')
    if (changeRuleList.length > 0 && Object.keys(formValues).length > 0) {
      changeRuleList.forEach((rule, index) => {
        const fieldNameList = collectFieldNameList(rule.fieldRule);
        // 此次改变的表单控件不在这个规则的依赖字段中,直接返回
        if (!fieldNameList.includes(changedFieldName)) {
          return;
        }
        const result = analysisFormChangeRule(rule.fieldRule, formValues);
        const showComponents = rule?.showComponents || [];
        const hideComponents = rule?.hideComponents || [];
        if (result) {
          const fieldVisible: FieldsVisible = {};
          showComponents.forEach((fieldName) => {
            fieldVisible[fieldName] = true;
          });
          hideComponents.forEach((fieldName) => {
            fieldVisible[fieldName] = false;
          });
          setFieldsVisible((oldVisible) => {
            const visible: FieldsVisible = {};
            Object.keys(fieldVisible).forEach((key) => {
              visible[key] = !fieldVisible[key];
            });
            cacheFieldsVisibleMap[index] = { ...visible };
            const result = Object.assign({}, oldVisible, fieldVisible);
            return result;
          });
          rule.hasChanged = true;
        } else {
          if (rule.hasChanged) {
            setFieldsVisible((oldVisible) => {
              const cacheFieldVisible = cacheFieldsVisibleMap[index];
              const result = Object.assign({}, oldVisible, cacheFieldVisible);
              return result;
            });
            rule.hasChanged = false;
          }
        }
      });


    }

    // 处理基础控件失焦时关联表格控件的数据联动
    const fieldConfig = compMaps[changedFieldName]
    const filledName: string = fieldConfig?.config.dataSource?.apiConfig.filledName?.key
    // filledName
    const tempMap = _.cloneDeep(configMap)
    if (filledName && tempMap) {
      // @ts-ignore
      tempMap.name = filledName

      tempMap[filledName] = {
        ...tempMap[filledName],
        [changedFieldName]: fieldChangedValue
      }
      try {
        // todo
        // const ret = await getFlowData(tempMap)
        // const {data} = ret
        // if(!data) return
        tempMap[filledName].tableData = [{
          key1: 'cxx' + fieldChangedValue,
          key2: 12 + filledName
        }]
        setConfigMap(tempMap)
      } catch (e) {
        console.log(e)
      }
    }
    console.log(tempMap, 'ffff')
  });

  const handleConfigMap = useMemoCallback((value: any) => {
    console.log(value, 'rrrcxzc')
    return value
  })

  // 处理日期规则联动校验
  const handleDisabledDate = useMemoCallback((current, props) => {
    const {id} = props.props;
    if (!id || !current) return false;
    const formValues = form.getFieldsValue();
    if (changeFieldRuleList.length && Object.keys(formValues).length) {
      const fieldRules = _.uniqWith(
        changeFieldRuleList
          .map((rule) => {
            return rule && collectFieldList(rule.fieldRule);
          })
          .flat(2),
        _.isEqual,
      );
      // 去重
      const filterRules = fieldRules.filter((item) => item && (item.fieldName === id || item.value === id));
      let rules1, rules2, rules3, rules4;
      filterRules.forEach((item) => {
        if (item?.symbol === 'earlier') {
          if (item.fieldName === id) {
            rules1 = current.valueOf() >= formValues[item.value as string];
          }
          if (item.value === id && item.fieldName) {
            rules2 = current.valueOf() <= formValues[item.fieldName];
          }
        }
        if (item?.symbol === 'latter') {
          if (item.fieldName === id) {
            rules3 = current.valueOf() <= formValues[item.value as string];
          }
          if (item.value === id && item.fieldName) {
            rules4 = current.valueOf() >= formValues[item.fieldName];
          }
        }
      });
      return rules2 || rules4 || rules1 || rules3;
    }
  });

  useEffect(() => {
    const visbles: FieldsVisible = {};
    const comMaps: { [key: string]: FormMeta['components'][number] } = {};
    const formValues: FormProps['initialValue'] = {};
    data.components.forEach((com) => {
      const { fieldName, id } = com.config;

      if (initialValue && initialValue[fieldName] !== undefined) {
        formValues[fieldName] = initialValue[fieldName];
      } else {
        formValues[fieldName || id] = com.props.defaultValue || com.config.value;
      }

      comMaps[id] = com;
      // 流程编排中没有配置fieldAuths这个字段默认可见
      visbles[fieldName || id] = fieldsAuths && fieldsAuths[fieldName || id] !== AuthType.Denied;
    });
    // 设置表单初始值
    form.setFieldsValue(formValues);
    const hiddenFieldMap: FieldsVisible = {};
    Object.keys(visbles).forEach((key) => {
      if (visbles[key] === false) {
        hiddenFieldMap[key] = false;
      }
    });
    // 设置字段可见性, 不能和下面代码交互执行顺序
    setFieldsVisible(visbles);

    setCompMaps(comMaps);
    // 设置完初始值后设置当前字段可见状态
    formValuesChange(formValues);

    setShowForm(true);
  }, [data, fieldsAuths, initialValue, form, formValuesChange]);

  useEffect(() => {
    // 进入表单时请求接口
    if (initRuleList.length > 0) {
      const formDataList: { name: string; value: any }[] = (Object.keys(initialValue) || []).map((name) => {
        return { name, value: initialValue[name] };
      });
      // 返回值映射列表
      const respListMap: { fieldName: string; name: string }[][] = [];
      const promiseList: Promise<any>[] = [];
      initRuleList.forEach((rule, index) => {
        const requestMapList = rule.request.required
          .concat(rule.request.customize)
          .map((item) => {
            const { map } = item;
            if (!map) {
              return '';
            }
            return String(map?.match(/(?<=\$\{).*?(?=\})/));
          })
          .filter((name) => name !== 'null' && name !== '');
        // 只要接口关联表单值得参数中有一个没有值就不请求接口
        const isEmpty = requestMapList.some((name) => {
          return initialValue[name] === undefined;
        });
        if (isEmpty) {
          return;
        }
        const resMap = ((rule?.response as ParamSchem[]) || []).map((res) => {
          if (!res) {
            return { fieldName: '', name: '' };
          }
          const { name, map } = res;
          const fieldName = String(map?.match(/(?<=\$\{).*?(?=\})/));
          return { fieldName, name };
        });
        respListMap.push(resMap);
        promiseList.push(runtimeAxios.post('/common/doHttpJson', { jsonObject: rule, formDataList }));
      });
      setLoading(true);
      Promise.all(promiseList)
        .then((resList) => {
          const formValues: { [k: string]: any } = {};
          resList.forEach((res, index) => {
            respListMap[index].forEach(({ fieldName, name }) => {
              if (fieldName && name) {
                // TODO 替换eval
                formValues[fieldName] = eval(`res.${name}`);
              }
            });
          });
          form.setFieldsValue(formValues);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [form, initRuleList, initialValue]);

  return (
    <Form
      className={classNames(styles.form, className)}
      ref={ref}
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={formValuesChange}
    >
      {loading && <Loading/>}
      {data.layout.map((formRow, index) => {
        // 空行或者所用组件未加载不渲染
        if (!formRow.length || !showForm || !compSources) return null;
        return (
          <Row key={index} className={styles.row}>
            {formRow.map((fieldId) => {
              const {config = {}, props = {}} = compMaps[fieldId];
              const {fieldName = '', colSpace = '', label = '', desc = '', type = '', flows = {}} = config;
              const isRequired = fieldsAuths && fieldsAuths[fieldName] === AuthType.Required;
              const compProps = {...props};
              const Component = compSources[config?.type as AllComponentType['type']];
              if (!fieldsVisible[fieldName || fieldId] || !Component) return null;
              delete compProps['defaultValue'];
              delete compProps['apiConfig'];
              let rules: Rule[] = [];
              if (isRequired) {
                rules = [
                  {
                    required: true,
                    message: `${label}不能为空`,
                  },
                ];
              }
              return (
                <Col span={colSpace * 6} key={fieldId} className={styles.col}>
                  <FormContainer
                    key={fieldId}
                    onChange={formValuesChange}
                  >
                    <Form.Item
                      key={fieldId}
                      name={fieldName || fieldId}
                      label={type !== 'DescText' ? <LabelContent label={label} desc={desc}/> : null}
                      required={isRequired}
                      rules={rules}
                    >
                      {compRender(
                        config.type,
                        Component,
                        Object.assign({}, compProps, {
                          disabled:
                            readonly ||
                            !(fieldsAuths[fieldName] || fieldsAuths[fieldId]) ||
                            fieldsAuths[fieldName] === AuthType.View,
                          flows,
                          configMap,
                          disabledDate: (v: any) => handleDisabledDate(v, compMaps[fieldId]),
                        }),
                        datasource && (datasource[fieldName] || datasource[fieldId]),
                        projectId,
                      )}
                    </Form.Item>
                  </FormContainer>
                </Col>
              );
            })}
          </Row>
        );
      })}
    </Form>
  );
});

export default memo(FormDetail);

function compRender(
  type: AllComponentType['type'],
  Component: any,
  props: any,
  datasource?: Datasource[keyof Datasource],
  projectId?: number,
) {
  if ((type === 'Select' || type === 'Radio' || type === 'Checkbox') && datasource) {
    return <Component {...props} options={datasource} />;
  }
  if (type === 'Member') {
    return <Component {...props} projectid={projectId} />;
  }
  return <Component {...props} />;
}
