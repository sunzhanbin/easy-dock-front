import { memo, useEffect, useMemo, useState } from 'react';
import { Form, Row, Col } from 'antd';
import { Rule, FormInstance } from 'antd/lib/form';
import { AllComponentType, CompConfig, Datasource, EventType } from '@/type';
import useLoadComponents from '@/hooks/use-load-components';
import { fetchDataSource } from '@/apis/detail';
import LabelContent from '../../../label-content';
import styles from './index.module.scss';
import { AuthType, FieldAuthsMap } from '@/type/flow';
import { useContainerContext } from '@/components/form-engine/context';
import PubSub from 'pubsub-js';
import { analysisFormChangeRule } from '@/utils';
import { formRulesItem, formRulesReturn, validateRules } from '@/components/form-engine/utils';
import useMemoCallback from '@common/hooks/use-memo-callback';

interface FormListProps {
  fields: CompConfig[];
  id: string;
  parentId: string;
  auth: FieldAuthsMap;
  projectId: number;
  readonly: boolean | undefined;
}

interface VisibleMap {
  [k: string]: boolean;
}

const FormList = ({ fields, id, parentId, auth = {}, readonly, projectId }: FormListProps) => {
  const context = useContainerContext();
  const [visibleMap, setVisibleMap] = useState<VisibleMap>({});
  const componentTypes = useMemo(() => {
    return fields.map((v) => v.config.type);
  }, [fields]);
  const optionComponents = useMemo(() => {
    return fields.filter((v) => ['Select', 'Radio', 'Checkbox'].includes(v.config.type)).map((v) => v.config);
  }, [fields]);
  const compSources = useLoadComponents(componentTypes);
  const [dataSourceMap, setDataSourceMap] = useState<Datasource>({});
  useEffect(() => {
    if (optionComponents.length > 0) {
      fetchDataSource(optionComponents as any).then((res) => {
        setDataSourceMap(res);
      });
    }
  }, [optionComponents]);
  const watchFn = useMemoCallback((rules: formRulesItem[]) => {
    return [
      ...new Set(
        rules.reduce((a, b) => {
          const { type, watch } = b;
          const watchType = watch.map((item) => `${item}-${type}`);
          return a.concat(watchType);
        }, [] as any),
      ),
    ];
  });
  const setFieldVisible = useMemoCallback((rules: formRulesItem[], form: FormInstance, name: string) => {
    const isMatchArr = rules?.filter((item) => {
      const { condition } = item;
      const formValues = form.getFieldValue(parentId)[id];
      return analysisFormChangeRule(condition, formValues);
    });
    if (isMatchArr?.length) {
      const current = isMatchArr[isMatchArr.length - 1];
      const { visible } = current;
      setVisibleMap((old) => Object.assign({}, old, { [name]: visible }));
    } else {
      setVisibleMap((old) => Object.assign({}, old, { [name]: true }));
    }
  });
  useEffect(() => {
    fields
      .map((v) => v.config.fieldName)
      .forEach((name) => {
        setVisibleMap((old) => Object.assign({}, old, { [name]: true }));
      });
  }, [fields, setVisibleMap]);
  useEffect(() => {
    if (context && context?.rules) {
      const { rules, form } = context;
      Object.keys(rules).forEach((key) => {
        const ruleList = ((rules as unknown) as formRulesReturn)[key];
        const visibleRules = ruleList?.filter((item) => item?.subtype === EventType.Visible);
        const watchList = watchFn(ruleList);
        const visibleWatchList = watchFn(visibleRules);
        watchList.forEach((field) => {
          PubSub.subscribe(field as string, (msg) => {
            if (visibleWatchList.includes(msg)) {
              setFieldVisible(visibleRules, form, key);
            }
          });
        });
      });
    }
  }, [context, setFieldVisible, watchFn]);
  return (
    <Form.List name={[parentId, id]}>
      {() => {
        return (
          <Row className={styles.row}>
            {fields.map((field) => {
              const { config, props } = field;
              const { fieldName = '', label = '', colSpace = 4, desc = '', type } = config;
              const Component = compSources ? compSources[type] : null;
              const dataSource = dataSourceMap[fieldName] || [];
              let fieldAuth = auth[fieldName] ?? AuthType.Edit;
              if (!visibleMap[fieldName]) {
                fieldAuth = AuthType.Denied;
              }
              if (fieldAuth === AuthType.Denied || !Component) {
                return null;
              }
              const isRequired = fieldAuth === AuthType.Required;
              const comProps = Object.assign({}, props, { disabled: fieldAuth === AuthType.View || readonly });
              const rules: Rule[] = validateRules(isRequired, label, type, props);
              return (
                <Col span={Number(colSpace) * 6} className={styles.col} key={fieldName}>
                  <Form.Item
                    name={fieldName}
                    label={type !== 'DescText' ? <LabelContent label={label} desc={desc} /> : null}
                    required={isRequired}
                    rules={rules}
                  >
                    {Component && compRender(type, Component, comProps, dataSource, projectId)}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        );
      }}
    </Form.List>
  );
};

export default memo(FormList);

function compRender(
  type: AllComponentType['type'],
  Component: any,
  props: any,
  dataSource?: Datasource[keyof Datasource],
  projectId?: number,
) {
  if ((type === 'Select' || type === 'Radio' || type === 'Checkbox') && dataSource) {
    return <Component {...props} options={dataSource} />;
  }
  if (type === 'Member') {
    return <Component {...props} projectid={projectId} />;
  }
  return <Component {...props} />;
}
