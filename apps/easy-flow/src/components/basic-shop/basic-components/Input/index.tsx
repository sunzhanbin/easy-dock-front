import React, { memo, useEffect, useMemo } from "react";
import styled from 'styled-components';
import { Input, Form, FormInstance } from "antd";
import { SingleTextField, TConfigItem } from "@/type";

const InputComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width:100%;
`;

const InputComponent = (props: SingleTextField & { id: string, form: FormInstance }) => {
  const { label, defaultValue, tip, id, form } = props;
  useEffect(() => {
    const value: TConfigItem = {};
    value[id] = defaultValue;
    form.setFieldsValue(value);
  }, [id, defaultValue])
  const renderLabel = useMemo(() => {
    return (
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
    )
  }, [tip, label])
  return (
    <InputComponentContainer>
      <Form.Item
        label={renderLabel}
        initialValue={defaultValue}
        name={id}
      >
        <Input />
      </Form.Item>
    </InputComponentContainer>
  );
};

export default memo(InputComponent);