import { useAppSelector } from '@/app/hooks';
import { flowDataSelector } from '../flow-slice';
import { Member } from '@type';

export default function useShowMembers(memberIds: (number | string)[]) {
  const { cacheMembers } = useAppSelector(flowDataSelector);

  return memberIds
    .map((id) => {
      return <Member>cacheMembers[id];
    })
    .filter(Boolean);
}
