import React, { memo } from "react";
import { Form, Select } from "antd";
import { FormInstance } from "antd/es";
import { Icon } from "@common/components";
import { useGetTenantListQuery } from "@/http";

type LinkedUserProps = {
  form: FormInstance<any>;
};

const { Option } = Select;
const LinkedUser = ({ form }: LinkedUserProps) => {
  const { tenantList } = useGetTenantListQuery("", {
    selectFromResult: ({ data }) => ({
      tenantList: data?.filter(Boolean),
    }),
  });
  return (
    <>
      {form.getFieldValue(["tenant", "link"]) === "2" && (
        <Form.Item
          name={["tenant", "code"]}
          noStyle
          required
          rules={[
            {
              required: true,
              message: "请选择关联租户",
            },
          ]}
        >
          <Select size="large" placeholder="请选择" suffixIcon={<Icon type="xiala" />}>
            {(tenantList ?? []).map(({ code, name }: { code: string; name: string }) => (
              <Option key={code} value={code}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </>
  );
};

const LinkedUserComponent = (props: LinkedUserProps) => {
  return (
    <Form.Item name="tenant" noStyle>
      <LinkedUser {...props} />
    </Form.Item>
  );
};
export default memo(LinkedUserComponent);
