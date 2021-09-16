import { memo, useEffect, Fragment, useMemo, ReactNode } from 'react';
import { Form, Select, Input, Switch, Radio, Checkbox, InputNumber } from 'antd';
import SelectOptionList from '../select-option-list';
import SelectDefaultOption from '../select-default-option';
import DefaultDate from '../default-date';
import Editor from '../rich-text';
import { FormField, rangeItem, SchemaConfigItem } from '@/type';
import { Store } from 'antd/lib/form/interface';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { errorSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { Icon } from '@common/components';
import { Rule } from 'antd/lib/form';

const { Option } = Select;

interface CompAttrEditorProps {
  config: SchemaConfigItem[];
  initValues: FormField;
  componentId: string;
  onSave: Function;
}
interface ComponentProps {
  id: string;
  label: string;
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

const componentMap: { [k in string]: (props: { [k in string]: any }) => ReactNode } = {
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
  ColSpace: () => <Radio.Group options={options} optionType="button" />,
  Checkbox: (props) => <Checkbox>{props.label}</Checkbox>,
  Switch: () => <Switch />,
  SelectOptionList: () => <SelectOptionList />,
  SelectDefaultOption: (props) => <SelectDefaultOption id={props.componentId} />,
  InputNumber: (props) => <InputNumber size="large" className="input_number" placeholder={props.placeholder} />,
  DefaultDate: (props) => <DefaultDate id={props.componentId} />,
  Editor: () => <Editor />,
};

const FormItemWrap = (props: ComponentProps) => {
  const { id, label, required, type, requiredMessage, rules, children } = props;
  return (
    <Form.Item
      label={label}
      name={id}
      valuePropName={type === 'Switch' || type === 'Checkbox' ? 'checked' : 'value'}
      labelCol={{ span: type === 'Switch' || type === 'Checkbox' ? 0 : 24 }}
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
  const { config, initValues, componentId, onSave } = props;
  const [form] = Form.useForm();
  const errors = useAppSelector(errorSelector);
  const errorIdList = useMemo(() => (errors || []).map(({ id }) => id), [errors]);
  const onFinish = (values: Store) => {
    const isValidate = form.isFieldsTouched(['fieldName', 'label']);
    onSave && onSave(values, isValidate);
  };
  const handleChange = () => {
    onFinish(form.getFieldsValue());
  };

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
        name="form_editor"
        autoComplete="off"
        initialValues={initValues}
        onFinish={onFinish}
        onValuesChange={handleChange}
      >
        {config.map(({ key, label, type, range, placeholder, required, requiredMessage, rules }) => {
          const props = { placeholder, range, label, componentId };
          const component = componentMap[type](props);
          return (
            <Fragment key={key}>
              <FormItemWrap
                id={key}
                label={label as string}
                type={type}
                required={required}
                requiredMessage={requiredMessage}
                rules={rules}
              >
                {component}
              </FormItemWrap>
            </Fragment>
          );
        })}
      </Form>
    </div>
  );
};

export default memo(CompAttrEditor);