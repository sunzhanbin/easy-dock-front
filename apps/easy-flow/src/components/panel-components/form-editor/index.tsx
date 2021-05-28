import React, { memo, useMemo, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { Form, Select, InputNumber, Input, Switch, Radio, Checkbox } from 'antd';
import SelectOptionList from '../select-option-list';
import { FormField, SchemaConfigItem } from '@/type';
import { Store } from 'antd/lib/form/interface';
import selectedImage from '@assets/selected.png';

const { Option } = Select;

const Container = styled.div`
    .ant-form-item-label{
        padding-bottom: 4px;
        >label{
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            font-weight: 500;
            color: rgba(24, 31, 67, 0.95);
        }
    }
    .ant-radio-group{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .ant-radio-button-wrapper{
            width: 47px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            background: rgba(24, 39, 67, 0.04);
            border-radius: 3px;
            border: none;
            font-weight: 400;
            color: rgba(24, 31, 67, 0.95);
            box-shadow: none !important;
            &:hover{
                color: #4C5CDB;
            }
        }
        .ant-radio-button-wrapper:not(:first-child)::before{
            display: none;
        }
        .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
            color: #4C5CDB;
            background-image: url(${selectedImage});
            background-position: top right;
            background-repeat: no-repeat;
        }
    }
    .ant-form-item-label-left{
        height: 32px;
        line-height: 32px;
    }
    .ant-switch{
        float: right;
    }
`
interface FormEditorProps {
    config: SchemaConfigItem[];
    initValues: FormField;
    componentId: string;
    onSave: Function;
}
const options = [
    { label: '1/4', value: '1' },
    { label: '1/2', value: '2' },
    { label: '3/4', value: '3' },
    { label: '1', value: '4' },
]

const FormEditor = (props: FormEditorProps) => {
    const { config, initValues, componentId, onSave } = props;
    const [form] = Form.useForm();
    const onFinish = (values: Store) => {
        onSave && onSave(values);
    };
    const handleChange = () => {
        onFinish(form.getFieldsValue());
    };
    useEffect(() => {
        form.setFieldsValue(initValues);
    }, [initValues])

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
                    config.map(({ key, label, direction, type, range, placeholder }) => {
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
                                            <Input placeholder={placeholder} />
                                        </Form.Item>
                                    )
                                }
                                {
                                    type === 'Textarea' && (
                                        <Form.Item
                                            label={label}
                                            name={key}
                                            labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                                            labelAlign="left"
                                        >
                                            <Input.TextArea placeholder={placeholder} rows={4} />
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
                                            <Radio.Group
                                                options={options}
                                                optionType="button"
                                            />
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
                                            colon={false}
                                            labelCol={{ span: direction === 'vertical' ? 0 : 0 }}
                                            labelAlign="left"
                                            valuePropName="checked"
                                        >
                                            <Switch></Switch>
                                        </Form.Item>
                                    )
                                }
                                {
                                    type === 'SelectOptionList' && (
                                        <Form.Item
                                            label={label}
                                            name={key}
                                            colon={false}
                                            labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                                            labelAlign="left"
                                        >
                                            <SelectOptionList />
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