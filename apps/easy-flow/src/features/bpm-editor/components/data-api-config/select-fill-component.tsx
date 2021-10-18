import {memo, useContext, useMemo} from 'react';
import {Form, Select} from 'antd';
import styles from './index.module.scss';
import {Icon} from "@common/components";

const {Option} = Select

interface FillComponentProps {
  label: string;
}

function FillComponent(props: FillComponentProps) {
  const {label} = props;
  const options = useMemo(() => {
    return [
      {key: '1', value: '选项1'},
      {key: '2', value: '选项2'}
    ];
  }, []);

  return (
    <>
      <div className={styles.subtitle}>{label}</div>
      <Form.Item>
        <Select placeholder="请输入" size="large" suffixIcon={<Icon type="xiala"/>}>
          {options.map((v) => (
            <Option value={v.key} key={v.key}>
              {v.value}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
}

export default memo(FillComponent);
