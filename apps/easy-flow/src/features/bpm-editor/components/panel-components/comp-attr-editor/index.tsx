import React, { Fragment, memo, ReactNode, useEffect, useMemo } from 'react';
import { Checkbox, Form, Input, InputNumber, Radio, Select, Switch } from 'antd';
import SelectOptionList from '../select-option-list';
import SelectDefaultOption from '../select-default-option';
import DefaultDate from '../default-date';
import Editor from '../rich-text';
import FieldManage from '../field-manage';
import { FormField, rangeItem, SchemaConfigItem } from '@/type';
import { Store } from 'antd/lib/form/interface';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { errorSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { Icon } from '@common/components';
import { Rule } from 'antd/lib/form';
import useMemoCallback from '@common/hooks/use-memo-callback';
import SelectColumns from '../select-columns';
import SerialRules from '../serial-rules';
import NumberOption from '../number-options';
import AllowDecimal from '../allow-decimal';
import LimitRange from '../limit-range';
import DateRange from '../date-range';
import { LABEL_INCLUDE_CHECKBOX, LABEL_LINKED_RULES } from '@utils/const';
import FilesType from '@/features/bpm-editor/components/panel-components/files-type';

const { Option } = Select;

interface CompAttrEditorProps {
  config: SchemaConfigItem[];
  initValues: FormField;
  componentId: string;
  componentType: string;
  onSave: Function;
}

interface ComponentProps {
  id: string;
  componentId?: string;
  label?: string | ReactNode;
  type: string;
  required?: boolean;
  requiredMessage?: string;
  rules?: Rule[];
  children?: ReactNode;
}

const options = [
  { label: '1/4', value: '1' },
  { label: '1/2', value: '2' },
  { label: '3/4', value: '3' },
  { label: '1', value: '4' },
];
// const rowOptions = [
//   { label: '1/4', value: '1', disabled: true },
//   { label: '1/2', value: '2', disabled: true },
//   { label: '3/4', value: '3', disabled: true },
//   { label: '1', value: '4' },
// ];

const componentMap: { [k: string]: (props: { [k: string]: any }) => ReactNode } = {
  Input: (props) => <Input placeholder={props.placeholder} size="large" />,
  Textarea: (props) => <Input.TextArea placeholder={props.placeholder} rows={4} size="large" />,
  Select: (props) => (
    <Select placeholder={props.placeholder || '请选择'} size="large" suffixIcon={<Icon type="xiala" />}>
      {props.range &&
        (props.range as rangeItem[]).map((v) => (
          <Option value={v.key} key={v.key}>
            {v.value}
          </Option>
        ))}
    </Select>
  ),
  ColSpace: () => {
    return <Radio.Group options={options} optionType="button" />;
  },
  Checkbox: (props) => <Checkbox>{props.label}</Checkbox>,
  Switch: () => <Switch />,
  NumberOption: (props) => <NumberOption id={props.componentId} />,
  serialRules: (props) => <SerialRules id={props.componentId} />,
  selectColumns: (props) => <SelectColumns id={props.componentId} />,
  SelectOptionList: (props) => <SelectOptionList id={props.componentId} />,
  SelectDefaultOption: (props) => <SelectDefaultOption id={props.componentId} />,
  InputNumber: (props) => (
    <InputNumber
      size="large"
      className="input_number"
      min={props.min}
      max={props.max}
      placeholder={props.placeholder}
      {...(props.precision === undefined ? {} : { precision: props.precision })}
    />
  ),
  DefaultDate: (props) => <DefaultDate id={props.componentId} />,
  Editor: () => <Editor />,
  FieldManage: (props) => <FieldManage parentId={props.parentId} />,
};

const NumberContainer = ({ children, ...rest }: any) => {
  return React.cloneElement(children, rest);
};

const CheckComponentType: { [key: string]: (id: string, componentId?: string) => any } = {
  precision: (id) => (
    <NumberContainer>
      <AllowDecimal id={id} />
    </NumberContainer>
  ),
  numrange: (id) => <LimitRange id={id} />,
  daterange: (id, componentId) => componentId && <DateRange id={id} componentId={componentId} />,
  filetype: (componentId) => componentId && <FilesType componentId={componentId} />,
};

const FormItemWrap = (props: ComponentProps) => {
  const { id, label, required, type, requiredMessage, rules, children, componentId } = props;

  if (LABEL_INCLUDE_CHECKBOX.includes(type)) {
    return (
      <Form.Item name={[id, 'enable']} valuePropName="checked">
        <Checkbox>{label}</Checkbox>
      </Form.Item>
    );
  }

  if (LABEL_LINKED_RULES.includes(type)) {
    return CheckComponentType[type](id, componentId);
  }

  return (
    <Form.Item
      label={label}
      name={id}
      valuePropName={type === 'Switch' || type === 'Checkbox' ? 'checked' : 'value'}
      labelCol={{ span: type === 'Switch' || type === 'Checkbox' ? 12 : 24 }}
      labelAlign="left"
      required={required}
      rules={
        rules
          ? [...rules, { required: required, message: requiredMessage }]
          : [{ required: required, message: requiredMessage }]
      }
    >
      {children ? children : null}
    </Form.Item>
  );
};

const CompAttrEditor = (props: CompAttrEditorProps) => {
  const { config, initValues, componentId, componentType, onSave } = props;
  const [form] = Form.useForm();
  const errors = useAppSelector(errorSelector);
  const errorIdList = useMemo(() => (errors || []).map(({ id }) => id), [errors]);
  const onFinish = useMemoCallback((values: Store) => {
    console.log(values, '---------------');
    const isValidate = form.isFieldsTouched(['fieldName', 'label']);
    onSave && onSave(values, isValidate);
  });
  const handleChange = useMemoCallback(() => {
    onFinish(form.getFieldsValue());
  });

  useEffect(() => {
    if (errorIdList.includes(componentId)) {
      form.validateFields();
    }
    return () => {
      form.resetFields();
    };
  }, [componentId, form, errorIdList]);
  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [initValues, form]);

  return (
    <div className={styles.container}>
      <Form
        form={form}
        key={componentId}
        name="form_editor"
        autoComplete="off"
        initialValues={initValues}
        onFinish={onFinish}
        onValuesChange={handleChange}
      >
        {config.map(
          ({ key, label, type, range, placeholder, required, requiredMessage, rules, max, min, precision }) => {
            const props: { [k: string]: any } = {
              placeholder,
              range,
              label,
              componentId,
              max,
              min,
              precision,
              type,
              componentType,
              parentId: componentId,
            };
            const component =
              ![...LABEL_INCLUDE_CHECKBOX, ...LABEL_LINKED_RULES].includes(type) && componentMap[type](props);

            return (
              <Fragment key={key}>
                <FormItemWrap
                  id={key}
                  label={label}
                  type={type}
                  componentId={componentId}
                  required={required}
                  requiredMessage={requiredMessage}
                  rules={rules}
                >
                  {component}
                </FormItemWrap>
              </Fragment>
            );
          },
        )}
      </Form>
    </div>
  );
};

export default memo(
  CompAttrEditor,
  (prev, current) => prev.initValues === current.initValues && prev.componentId === current.componentId,
);
