import React, { memo, useEffect, useMemo } from "react";
import styled from 'styled-components';
import { Input, Form, FormInstance } from "antd";
import { SingleTextField, TConfigItem } from "@/type";

const { TextArea } = Input;

const TextareaComponentContainer = styled.div`
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

const TextareaComponent = (props: SingleTextField & { id: string, form: FormInstance }) => {
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
        <TextareaComponentContainer>
            <Form.Item
                label={renderLabel}
                initialValue={defaultValue}
                name={id}
            >
                <TextArea rows={4} />
            </Form.Item>
        </TextareaComponentContainer>
    );
};

export default memo(TextareaComponent);