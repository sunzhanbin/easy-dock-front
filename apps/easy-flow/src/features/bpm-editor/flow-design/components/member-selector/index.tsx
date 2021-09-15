import { memo, useMemo } from 'react';
import { MemberSelector as Selector, MemberSelectorProps as SelectorProps } from '@common/components';
import { UserNode, CorrelationMemberConfigKey } from '@type/flow';
import { useSubAppDetail } from '@app/app';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { flowDataSelector, setCacheMembers } from '../../flow-slice';

interface MemberSelectorProps {
  value?: UserNode['correlationMemberConfig'];
  onChange?(value: this['value']): void;
}

function MemberSelector(props: MemberSelectorProps) {
  const { cacheMembers, fieldsTemplate } = useAppSelector(flowDataSelector);
  const { value, onChange } = props;
  const { data: subAppDetail } = useSubAppDetail();
  const dispatch = useAppDispatch();
  const dynamicFields = useMemo(() => {
    return fieldsTemplate
      .filter((field) => field.type === 'Member')
      .map((field) => ({ name: field.name, key: field.id }));
  }, [fieldsTemplate]);

  const showValue: NonNullable<SelectorProps['value']> = useMemo(() => {
    const { members = [], depts = [], roles = [], dynamic } = value!;
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
  }, [value, cacheMembers, dynamicFields]);

  const handleChange = (value: NonNullable<SelectorProps['value']>) => {
    const caches: Parameters<typeof setCacheMembers>[number] = {};
    const { members = [], depts = [], roles = [], dynamic } = value;
    const memberIds: CorrelationMemberConfigKey[] = [];
    const deptIds: CorrelationMemberConfigKey[] = [];
    const roleIds: CorrelationMemberConfigKey[] = [];

    members.forEach((user) => {
      caches[user.id] = user;
      memberIds.push(user.id);
    });

    depts.forEach((dept) => {
      caches[dept.id] = dept;
      deptIds.push(dept.id);
    });

    roles.concat(dynamic?.roles || []).forEach((role) => {
      caches[role.id] = role;
      roleIds.push(role.id);
    });

    dispatch(setCacheMembers(caches));

    if (onChange) {
      onChange({
        members: memberIds,
        depts: depts.map((depart) => depart.id),
        roles: roles.map((role) => role.id),
        dynamic: {
          starter: dynamic?.starter,
          roles: (dynamic?.roles || []).map((role) => role.id),
          fields: (dynamic?.fields || []).map((field) => field.key),
        },
      });
    }
  };

  return (
    <Selector
      projectId={subAppDetail?.app.project.id}
      value={showValue}
      onChange={handleChange}
      strictDept
      dynamicFields={dynamicFields}
    />
  );
}

export default memo(MemberSelector);
