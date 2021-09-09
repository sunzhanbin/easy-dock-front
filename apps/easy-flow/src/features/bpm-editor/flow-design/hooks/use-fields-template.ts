import { useAppSelector } from '@/app/hooks';
import { fieldsTemplateSelector } from '../flow-slice';
import { FieldTemplate } from '@type/flow';

export default function useFieldsTemplate(): FieldTemplate[] {
  return useAppSelector(fieldsTemplateSelector);
}
