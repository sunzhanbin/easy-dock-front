import { useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { flowDataSelector, fieldsTemplateSelector } from '../flow-slice';
import { CorrelationMemberConfig } from '@type/flow';

export default function useShowMembers(correlationMemberConfig: CorrelationMemberConfig) {
  const { cacheMembers } = useAppSelector(flowDataSelector);
  const fieldsTemplate = useAppSelector(fieldsTemplateSelector);

  const dynamicFields = useMemo(() => {
    return fieldsTemplate.map((field) => ({ name: field.name, key: field.id }));
  }, [fieldsTemplate]);

  return useMemo(() => {
    const { members = [], depts = [], roles = [], dynamic } = correlationMemberConfig;
    const fieldsMap = (dynamic?.fields || []).reduce((curr, next) => {
      curr[next] = true;
      return curr;
    }, {} as { [key: string]: true });

    return {
      depts: depts.map((id) => ({ ...cacheMembers[id] })),
      members: members.map((id) => ({ ...cacheMembers[id] })),
      roles: roles.map((id) => ({ ...cacheMembers[id] })),
      dynamic: {
        starter: dynamic?.starter,
        roles: (dynamic?.roles || []).map((id) => ({ ...cacheMembers[id] })),
        fields: dynamicFields.filter((field) => fieldsMap[field.key]),
      },
    };
  }, [correlationMemberConfig, cacheMembers, dynamicFields]);
}
