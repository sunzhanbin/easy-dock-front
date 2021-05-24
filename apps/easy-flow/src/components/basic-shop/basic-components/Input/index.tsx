import React, { memo, useMemo, useEffect } from "react";
import styled from 'styled-components';
import { Input, Form, FormInstance } from "antd";
import { SingleTextField, TConfigItem } from "@/type";

const InputComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width:100%;
  .title{
    display: flex;
    justify-content: space-between;
    padding: 0 0 8px;
    font-weight: 500;
    word-wrap: break-word;
  }
`;

const InputComponent = (props: SingleTextField & { id: string, form: FormInstance }) => {
  const { title, placeholder, defaultValue, required, disabled, readonly, visible, allowClear, bordered, id, form } = props;
  const rules = useMemo(() => {
    const ruleList = [];
    if (required) {
      ruleList.push({ required: true });
    }
    return ruleList;
  }, [required]);
  useEffect(() => {
    const value: TConfigItem = {};
    value[id] = defaultValue;
    form.setFieldsValue(value);
  }, [id, defaultValue])
  return (
    <InputComponentContainer style={{ display: visible ? 'flex' : 'none' }}>
      <Form.Item
        label={title}
        rules={rules}
        required={required}
        initialValue={defaultValue}
        name={id}
      >
        <Input
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
          allowClear={allowClear}
          bordered={bordered}
        />
      </Form.Item>
    </InputComponentContainer>
  );
};

export default memo(InputComponent);