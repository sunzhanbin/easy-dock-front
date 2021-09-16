import { memo, useContext, useMemo } from 'react';
import { Form, Input } from 'antd';
import DataContext from './context';
import styles from './index.module.scss';
import { AutoSelector } from './components/map';

interface ResponseNoMapProps {
  label: string;
}

function ResponseNoMap(props: ResponseNoMapProps) {
  const { label } = props;
  const { name: parentName, detail, getPopupContainer } = useContext(DataContext)!;
  const optionals = detail?.responses || [];
  const name = useMemo(() => {
    return [...parentName, 'response'];
  }, [parentName]);
  const options = useMemo(() => {
    return optionals.map((op) => ({ id: op.name, name: op.name }));
  }, [optionals]);

  return (
    <>
      <div className={styles.subtitle}>{label}</div>

      <Form.Item name={[...name, 'name']}>
        {optionals.length > 0 ? (
          <AutoSelector options={options} getPopupContainer={getPopupContainer} />
        ) : (
          <Input placeholder="请输入" size="large" />
        )}
      </Form.Item>
    </>
  );
}

export default memo(ResponseNoMap);
