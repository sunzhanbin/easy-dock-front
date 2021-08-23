import { memo, useMemo } from 'react';
import { MemberList } from '@common/components/member-selector';
import useShowMembers from '../../hooks/use-show-members';

interface AllMemberListProps {
  node: Parameters<typeof useShowMembers>[0];
}

function AllMemberList(props: AllMemberListProps) {
  const { node } = props;
  const [members, depts, roles] = useShowMembers(node);
  const showMemberList = useMemo(() => {
    if (members.length || depts.length || roles.length) return true;

    return false;
  }, [members.length, depts.length, roles.length]);

  if (showMemberList) return <MemberList members={members} depts={depts} roles={roles} />;

  return <div>设置此节点</div>;
}

export default memo(AllMemberList);
