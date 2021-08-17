import { memo, useContext } from 'react';
import { Form, Select } from 'antd';
import DataContext from '../context';

interface FieldMapProps {
  name: (string | number)[];
}

function FieldMap(props: FieldMapProps) {
  const { name } = props;
  const { fields, getPopupContainer } = useContext(DataContext)!;

  return (
    <Form.Item
      name={name}
      isListField
      style={{ paddingBottom: 12 }}
      rules={[
        {
          validator(_, val: string) {
            if (!val) {
              return Promise.reject(new Error('映射字段不能为空'));
            }

            return Promise.resolve();
          },
        },
      ]}
    >
      <Select size="large" placeholder="请选择" getPopupContainer={getPopupContainer}>
        {fields.map((item) => (
          <Select.Option value={item.id} key={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

export default memo(FieldMap);
