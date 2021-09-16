import React, { useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ProjectShape } from '../../types';
import styles from './index.module.scss';

export type FormType = FormInstance<{ name: string }>;

interface EditProjectFormProps {
  data?: ProjectShape;
  formRef?: React.MutableRefObject<FormType | undefined>;
}

function EditProjectForm(props: EditProjectFormProps) {
  const [form] = Form.useForm();
  const { data, formRef } = props;
  const nameRules = useMemo(() => {
    return [
      {
        validator(_: any, value: string) {
          if (value.length < 3 || value.length > 20 || /[^\u4e00-\u9fa5_\d\w]/.test(value)) {
            return Promise.reject(new Error('项目名为3-20位汉字、字母、数字、下划线'));
          } else {
            return Promise.resolve();
          }
        },
        required: true,
      },
    ];
  }, []);

  useEffect(() => {
    if (formRef) {
      formRef.current = form;
    }
  }, [formRef, form]);

  return (
    <Form className={styles.form} layout="vertical" form={form} initialValues={data} autoComplete="off">
      <Form.Item label="项目名称" name="name" rules={nameRules}>
        <Input placeholder="请填写项目名称" size="large" />
      </Form.Item>
    </Form>
  );
}

export default React.memo(EditProjectForm);
