import { memo, useMemo } from 'react';
import { MemberList } from '@common/components/member-selector';
import { CorrelationMemberConfig } from '@type/flow';
import useShowMembers from '../../hooks/use-show-members';

interface AllMemberListProps {
  config: CorrelationMemberConfig;
}

function AllMemberList(props: AllMemberListProps) {
  const { config } = props;
  const { members, depts, roles, dynamic } = useShowMembers(config);
  const showMemberList = useMemo(() => {
    if (
      members.length ||
      depts.length ||
      roles.length ||
      dynamic.starter ||
      dynamic.roles.length ||
      dynamic.fields.length
    )
      return true;

    return false;
  }, [members, depts, roles, dynamic]);

  if (showMemberList) return <MemberList members={members} depts={depts} roles={roles} dynamic={dynamic} />;

  return <div>设置此节点</div>;
}

export default memo(AllMemberList);
