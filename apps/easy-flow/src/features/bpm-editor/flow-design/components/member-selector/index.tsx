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
  const { cacheMembers } = useAppSelector(flowDataSelector);
  const { value, onChange } = props;
  const { data: subAppDetail } = useSubAppDetail();
  const dispatch = useAppDispatch();
  const showValue: NonNullable<SelectorProps['value']> = useMemo(() => {
    const { members = [], depts = [], roles = [] } = value!;

    return {
      depts: depts.map((id) => ({ ...cacheMembers[id] })),
      members: members.map((id) => ({ ...cacheMembers[id] })),
      roles: roles.map((id) => ({ ...cacheMembers[id] })),
    };
  }, [value, cacheMembers]);

  const handleChange = (value: NonNullable<SelectorProps['value']>) => {
    const caches: Parameters<typeof setCacheMembers>[number] = {};
    const { members = [], depts = [], roles = [] } = value;
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

    roles.forEach((role) => {
      caches[role.id] = role;
      roleIds.push(role.id);
    });

    dispatch(setCacheMembers(caches));

    if (onChange) {
      onChange({
        members: memberIds,
        depts: depts.map((depart) => depart.id),
        roles: roles.map((role) => role.id),
      });
    }
  };

  return (
    <Selector projectId={subAppDetail?.app.project.id} value={showValue} onChange={handleChange} strictDept={false} />
  );
}

export default memo(MemberSelector);
