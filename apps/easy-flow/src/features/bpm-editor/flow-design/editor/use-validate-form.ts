import { useEffect } from 'react';
import { FormInstance } from 'antd';
import { useAppSelector } from '@/app/hooks';
import { flowDataSelector } from '../flow-slice';

export default function useValidateForm<T = any>(form: FormInstance<T>) {
  const { saving } = useAppSelector(flowDataSelector);

  useEffect(() => {
    if (saving) {
      form.validateFields();
    }
  }, [form, saving]);
}
