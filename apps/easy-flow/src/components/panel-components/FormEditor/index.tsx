import React, { memo, useMemo, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { Form, Select, InputNumber, Input, Switch, Radio, Checkbox } from 'antd';
import ColSpace from '../ColSpace';
import { FormField, SchemaConfigItem, TConfigItem } from '@/type';
import { Store } from 'antd/lib/form/interface';

const { Option } = Select;

const Container = styled.div`

`
interface FormEditorProps {
    config: SchemaConfigItem[];
    initValues: FormField;
    componentId: string;
    onSave: Function;
}

const FormEditor = (props: FormEditorProps) => {
    const { config, initValues, componentId, onSave } = props;

    const onFinish = (values: Store) => {
        onSave && onSave(values);
    };
    const handleChange = () => {
        onFinish(form.getFieldsValue());
    };
    const [form] = Form.useForm();

    useEffect(() => {
        return () => {
            form.resetFields();
        };
    }, [componentId, form]);
    return (
        <Container>
            <Form
                form={form}
                name="form_editor"
                initialValues={initValues}
                onFinish={onFinish}
                onValuesChange={handleChange}
            >
                {
                    config.map(({ key, label, direction, type, range }) => {
                        return (
                            <Fragment key={key}>
                                {
                                    type === 'Input' && (
                                        <Form.Item
                                            label={label}
                                            name={key}
                                            labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                                            labelAlign="left"
                                        >
                                            <Input />
                                        </Form.Item>
                                    )
                                }
                                {
                                    type === 'Select' && (
                                        <Form.Item
                                            label={label}
                                            name={key}
                                            labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                                            labelAlign="left"
                                        >
                                            <Select placeholder="请选择">
                                                {
                                                    range && range.map(v => (
                                                        <Option value={v.key} key={v.key}>{v.value}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </Form.Item>
                                    )
                                }
                                {
                                    type === 'ColSpace' && (
                                        <Form.Item
                                            label={label}
                                            name={key}
                                            labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                                            labelAlign="left"
                                        >
                                            <ColSpace />
                                        </Form.Item>
                                    )
                                }
                                {
                                    type === 'Checkbox' && (
                                        <Form.Item
                                            label=""
                                            name={key}
                                            labelCol={{ span: direction === 'vertical' ? 0 : 0 }}
                                            labelAlign="left"
                                            valuePropName="checked"
                                        >
                                            <Checkbox>{label}</Checkbox>
                                        </Form.Item>
                                    )
                                }
                                {
                                    type === 'Switch' && (
                                        <Form.Item
                                            label={label}
                                            name={key}
                                            labelCol={{ span: direction === 'vertical' ? 0 : 0 }}
                                            labelAlign="left"
                                            valuePropName="checked"
                                        >
                                            <Switch></Switch>
                                        </Form.Item>
                                    )
                                }
                            </Fragment>
                        )
                    })
                }
            </Form>
        </Container>
    )
}

export default memo(FormEditor)