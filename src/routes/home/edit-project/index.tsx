import React, { useCallback, useMemo } from 'react';
import { Form, Input } from 'antd';
import ActionCard from '../action-card';
import { ProjectShape } from '../types';
import styles from './index.module.scss';

export interface EditProjectProps {
  data?: ProjectShape;
  onSubmit(values: ProjectShape & Omit<ProjectShape, 'id'>): Promise<void>;
  onCancel(): void;
}

function EditProject({ data, onSubmit, onCancel }: EditProjectProps) {
  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    await onSubmit(Object.assign({}, data, values));
  }, [onSubmit, form, data]);

  const nameRules = useMemo(() => {
    return [
      {
        validator(_: any, value: string) {
          if (value.length < 3 || value.length > 20 || /[^\u4e00-\u9fa5_\d\w]/.test(value)) {
            return Promise.reject(new Error('项目名为3-20位汉字、字母、数字、下划线！'));
          } else {
            return Promise.resolve();
          }
        },
        required: true,
      },
    ];
  }, []);

  return (
    <ActionCard title={data ? '编辑项目' : '新增项目'} onOk={handleSubmit} onCancel={onCancel}>
      <Form
        className={styles.form}
        layout="vertical"
        form={form}
        initialValues={data}
        name={data ? String(data.id) : 'new-project'}
      >
        <Form.Item label="项目名称" name="name" rules={nameRules}>
          <Input placeholder="请填写项目名称" minLength={3} maxLength={20} size="large"></Input>
        </Form.Item>
      </Form>
    </ActionCard>
  );
}

export default React.memo(EditProject);
