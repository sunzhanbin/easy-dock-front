import { useEffect } from 'react';
import { FormInstance } from 'antd';
import { useAppSelector } from '@/app/hooks';

export default function useValidateForm<T = any>(form: FormInstance<T>) {
  const saving = useAppSelector((state) => state.flow.saving);

  useEffect(() => {
    if (saving) {
      form.validateFields();
    }
  }, [form, saving]);
}
