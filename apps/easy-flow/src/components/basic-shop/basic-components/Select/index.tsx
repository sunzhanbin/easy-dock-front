import React, { FC, memo, useEffect, useMemo } from "react";
import { Form, FormInstance, Select } from "antd";
import styled from 'styled-components';
import { SelectField, TConfigItem } from "@/type";

const SelectComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const SelectComponent = (props: SelectField & { id: string, form: FormInstance }) => {
  const { label, defaultValue, tip, id, form, multiple, showSearch } = props;
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
    <SelectComponentContainer>
      <Form.Item
        label={renderLabel}
        initialValue={defaultValue}
        name={id}
      >
        <Select></Select>
      </Form.Item>
    </SelectComponentContainer>
  );
};

export default memo(SelectComponent);