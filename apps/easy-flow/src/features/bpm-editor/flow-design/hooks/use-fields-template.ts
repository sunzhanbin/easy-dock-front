import { useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { formMetaSelector } from '../flow-slice';
import { formatFieldsTemplate } from '../util';
import { FieldTemplate } from '@type/flow';

export default function useFieldsTemplate(): FieldTemplate[] {
  const form = useAppSelector(formMetaSelector);
  return useMemo(() => {
    return formatFieldsTemplate(form);
  }, [form]);
}
