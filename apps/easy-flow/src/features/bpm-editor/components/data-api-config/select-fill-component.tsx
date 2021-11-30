import {memo, useContext, useMemo} from 'react';
import {Form, Select} from 'antd';
import styles from './index.module.scss';
import {Icon} from "@common/components";
import DataContext from "./context";
import {OptionItem} from "@type";

const {Option} = Select

interface FillComponentProps {
  label: string;
  options: OptionItem[]
}

function FillComponent(props: FillComponentProps) {
  const {label, options} = props;
  const {name: parentName} = useContext(DataContext)!;
  const name = useMemo(() => {
    return [...parentName];
  }, [parentName]);

  return (
    <>
      <div className={styles.subtitle}>{label}</div>
      <Form.Item name={[...name, 'filledName']}>
        <Select placeholder="请输入" size="large" suffixIcon={<Icon type="xiala"/>} labelInValue={true}>
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
