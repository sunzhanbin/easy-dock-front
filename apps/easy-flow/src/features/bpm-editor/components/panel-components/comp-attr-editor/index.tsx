import { memo, useEffect, Fragment, useMemo, ReactNode } from 'react';
import { Form, Select, Input, Switch, Radio, Checkbox, InputNumber } from 'antd';
import SelectOptionList from '../select-option-list';
import SelectDefaultOption from '../select-default-option';
import DefaultDate from '../default-date';
import Editor from '../rich-text';
import { FormField, SchemaConfigItem } from '@/type';
import { Store } from 'antd/lib/form/interface';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { errorSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Icon } from '@common/components';

const { Option } = Select;

interface CompAttrEditorProps {
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
];

const componentMap: { [k in string]: (props: { [k in string]: any }) => ReactNode } = {
  Input: (props) => <Input {...props} size="large" />,
};

const FormItemWrap = (props: SchemaConfigItem & { children: ReactNode }) => {
  const { key, label, direction, type, range, placeholder, required, requiredMessage, rules, children } = props;
  return (
    <Form.Item
      label={label}
      name={key}
      labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
      labelAlign="left"
      required={required}
      rules={
        rules
          ? [...rules, { required: required, message: requiredMessage }]
          : [{ required: required, message: requiredMessage }]
      }
    >
      {children}
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

  const renderComponent = useMemoCallback((data: SchemaConfigItem & { children: ReactNode }) => {
    const { key, label, direction, type, range, placeholder, required, requiredMessage, rules, children } = data;
    return (
      <Form.Item
        label={label}
        name={key}
        labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
        labelAlign="left"
        required={required}
        rules={
          rules
            ? [...rules, { required: required, message: requiredMessage }]
            : [{ required: required, message: requiredMessage }]
        }
      >
        {children}
      </Form.Item>
    );
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
      <Form form={form} name="form_editor" initialValues={initValues} onFinish={onFinish} onValuesChange={handleChange}>
        {config.map(({ key, label, direction, type, range, placeholder, required, requiredMessage, rules }) => {
          const component = componentMap[type]
          return (
            <Fragment key={key}>
              {
                
              }
              {type === 'Input' && (
                <Form.Item
                  label={label}
                  name={key}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                  required={required}
                  rules={
                    rules
                      ? [...rules, { required: required, message: requiredMessage }]
                      : [{ required: required, message: requiredMessage }]
                  }
                >
                  <Input placeholder={placeholder} size="large" />
                </Form.Item>
              )}
              {type === 'Textarea' && (
                <Form.Item
                  label={label}
                  name={key}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                  required={required}
                  rules={[{ required: required, message: requiredMessage }]}
                >
                  <Input.TextArea placeholder={placeholder} rows={4} size="large" />
                </Form.Item>
              )}
              {type === 'Select' && (
                <Form.Item
                  label={label}
                  name={key}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                  required={required}
                  rules={[{ required: required, message: requiredMessage }]}
                >
                  <Select placeholder={placeholder || '请选择'} size="large" suffixIcon={<Icon type="xiala" />}>
                    {range &&
                      range.map((v) => (
                        <Option value={v.key} key={v.key}>
                          {v.value}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              )}
              {type === 'ColSpace' && (
                <Form.Item
                  label={label}
                  name={key}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                >
                  <Radio.Group options={options} optionType="button" />
                </Form.Item>
              )}
              {type === 'Checkbox' && (
                <Form.Item
                  label=""
                  name={key}
                  labelCol={{ span: direction === 'vertical' ? 0 : 0 }}
                  labelAlign="left"
                  valuePropName="checked"
                >
                  <Checkbox>{label}</Checkbox>
                </Form.Item>
              )}
              {type === 'Switch' && (
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
              )}
              {type === 'SelectOptionList' && (
                <Form.Item
                  label={label}
                  name={key}
                  colon={false}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                >
                  <SelectOptionList />
                </Form.Item>
              )}
              {type === 'SelectDefaultOption' && (
                <Form.Item
                  label={label}
                  name={key}
                  colon={false}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                >
                  <SelectDefaultOption id={componentId} />
                </Form.Item>
              )}
              {type === 'InputNumber' && (
                <Form.Item
                  label={label}
                  name={key}
                  colon={false}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                >
                  <InputNumber size="large" className="input_number" placeholder={placeholder} />
                </Form.Item>
              )}
              {type === 'DefaultDate' && (
                <Form.Item
                  label={label}
                  name={key}
                  colon={false}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                >
                  <DefaultDate id={componentId} />
                </Form.Item>
              )}
              {type === 'Editor' && (
                <Form.Item
                  label={label}
                  name={key}
                  colon={false}
                  labelCol={{ span: direction === 'vertical' ? 24 : 6 }}
                  labelAlign="left"
                >
                  <Editor />
                </Form.Item>
              )}
            </Fragment>
          );
        })}
      </Form>
    </div>
  );
};

export default memo(CompAttrEditor);
