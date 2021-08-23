import { useAppSelector } from '@/app/hooks';
import { flowDataSelector } from '../flow-slice';
import { AuditNode, FillNode, CCNode } from '@type/flow';

export default function useShowMembers(node: AuditNode | FillNode | CCNode) {
  const { cacheMembers } = useAppSelector(flowDataSelector);
  const { members = [], depts = [], roles = [] } = node.correlationMemberConfig;

  return [
    members.map((memberId) => cacheMembers[memberId]),
    depts.map((deptId) => cacheMembers[deptId]),
    roles.map((roleId) => cacheMembers[roleId]),
  ];
}
