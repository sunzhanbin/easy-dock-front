import { memo, useContext, useMemo } from 'react';
import { Form, Input, Select } from 'antd';
import DataContext from './context';
import styles from './index.module.scss';

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

  return (
    <>
      <div className={styles.subtitle}>{label}</div>

      <Form.List name={name}>
        {() => (
          <>
            <Form.Item name={[0, 'name']}>
              {optionals.length > 0 ? (
                <Select size="large" placeholder="请选择" getPopupContainer={getPopupContainer}>
                  {optionals.map((item) => (
                    <Select.Option value={item.name} key={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Input placeholder="请输入" size="large" />
              )}
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}

export default memo(ResponseNoMap);
