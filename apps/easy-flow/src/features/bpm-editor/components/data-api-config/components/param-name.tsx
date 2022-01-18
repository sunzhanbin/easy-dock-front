import { memo, ReactNode } from "react";
import { Form } from "antd";

interface ParamNameProps {
  name: (string | number)[];
  children?: ReactNode;
}

function ParamName(props: ParamNameProps) {
  const { name, children } = props;

  return (
    <Form.Item
      name={name}
      isListField
      style={{ paddingBottom: 12 }}
      rules={[
        {
          validator(_, val: string) {
            if (!val) return Promise.reject(new Error("参数名称不能为空"));

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
