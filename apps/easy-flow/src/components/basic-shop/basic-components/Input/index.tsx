import React, { memo, useMemo } from "react";
import styled from 'styled-components';
import { Input, Form } from "antd";
import { SingleTextField } from "@/type";

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

const InputComponent = (props: SingleTextField) => {
  const { title, placeholder, defaultValue, required, disabled, readonly, visible, allowClear, bordered } = props;
  const rules = useMemo(() => {
    const ruleList = [];
    if (required) {
      ruleList.push({ required: true });
    }
    return ruleList;
  }, [required])
  return (
    <InputComponentContainer>
      <Form.Item
        label={title}
        rules={rules}
        required={required}
        initialValue={defaultValue}
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