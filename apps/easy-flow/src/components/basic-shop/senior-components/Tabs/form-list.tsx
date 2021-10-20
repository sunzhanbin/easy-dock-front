import { memo, useEffect, useMemo, useState } from 'react';
import { Form, Row, Col } from 'antd';
import { AllComponentType, CompConfig, Datasource } from '@/type';
import useLoadComponents from '@/hooks/use-load-components';
import { fetchDataSource } from '@/apis/detail';
import { useSubAppDetail } from '@/app/app';
import LabelContent from '../../../label-content';
import styles from './index.module.scss';

interface FormListProps {
  fields: CompConfig[];
  key: string;
}

const FormList = ({ fields, key }: FormListProps) => {
  const componentTypes = useMemo(() => {
    return fields.map((v) => v.type);
  }, [fields]);
  const optionComponents = useMemo(() => {
    return fields.filter((v) => ['Select', 'Radio', 'Checkbox'].includes(v.type)).map((v) => v.config);
  }, [fields]);
  const subAppDetail = useSubAppDetail();
  const projectId = useMemo(() => {
    if (subAppDetail && subAppDetail.data && subAppDetail.data.app) {
      return subAppDetail.data.app.project.id;
    }
  }, [subAppDetail]);
  const compSources = useLoadComponents(componentTypes);
  const [dataSourceMap, setDataSourceMap] = useState<Datasource>({});
  useEffect(() => {
    if (optionComponents.length > 0) {
      fetchDataSource(optionComponents).then((res) => {
        setDataSourceMap(res);
      });
    }
  }, [optionComponents]);
  return (
    <Form.List name={['fields', 'tabs']} key={key}>
      {() => {
        return (
          <Row className={styles.row}>
            {fields.map((field) => {
              const { type, config = {} } = field;
              const { fieldName = '', label = '', colSpace = '4', desc = '' } = config;
              const Component = compSources ? compSources[type] : null;
              const dataSource = dataSourceMap[fieldName] || [];
              return (
                <Col span={Number(colSpace) * 6} className={styles.col}>
                  <Form.Item
                    name={fieldName}
                    label={type !== 'DescText' ? <LabelContent label={label} desc={desc} /> : null}
                  >
                    {Component && compRender(type, Component, config, dataSource, projectId)}
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
