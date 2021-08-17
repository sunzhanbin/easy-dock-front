import { memo, ReactNode } from 'react';
import { Form } from 'antd';

interface ParamNameProps {
  name: (string | number)[];
  children?: ReactNode;
}

function ParamName(props: ParamNameProps) {
  const { name, children } = props;

  return (
    <Form.Item
      name={name}
      rules={[
        {
          validator(_, val: string) {
            if (!val) return Promise.reject(new Error('参数名称不能为空'));

            if (!/^([\w\d_]+\.)*([\w\d_])+$/.test(val))
              return Promise.reject(new Error('参数名称格式为字母、数字、英文.号、下划线'));

            return Promise.resolve();
          },
        },
      ]}
    >
      {children}
    </Form.Item>
  );
}

export default memo(ParamName);
