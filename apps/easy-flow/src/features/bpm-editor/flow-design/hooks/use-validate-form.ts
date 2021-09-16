import { useEffect } from 'react';
import { FormInstance } from 'antd';
import { useAppSelector } from '@/app/hooks';

export default function useValidateForm<T = any>(form: FormInstance<T>, nodeId: string) {
  const shouldValid = useAppSelector((state) => {
    if (nodeId) {
      const validInfo = state.flow.invalidNodesMap[nodeId];

      if (validInfo && validInfo.errors.length > 0) {
        return true;
      }
    }

    return state.flow.saving;
  });

  useEffect(() => {
    if (shouldValid) {
      const timer = setTimeout(() => {
        form.validateFields();
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [form, shouldValid]);
}
