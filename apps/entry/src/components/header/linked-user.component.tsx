import { memo, useEffect, useState } from "react";
import { Form, Input } from "antd";
import { FormInstance } from "antd/es";

type LinkedUserProps = {
  form: FormInstance<any>;
};

const LinkedUser = ({ form }: LinkedUserProps) => {
  return (
    <>
      {form.getFieldValue("appId") === "2" && (
        <Form.Item name={["appId", "user"]} noStyle>
          <Input placeholder="请输入" size="large" />
        </Form.Item>
      )}
    </>
  );
};

const LinkedUserComponent = (props: LinkedUserProps) => {
  return (
    <Form.Item name="appId" noStyle>
      <LinkedUser {...props} />
    </Form.Item>
  );
};
export default memo(LinkedUserComponent);
