import { useAppSelector } from '@/app/hooks';
import { flowDataSelector } from '../flow-slice';
import { Member } from '@type';

export default function useShowMembers(members: string[]) {
  const { cacheMembers } = useAppSelector(flowDataSelector);

  return members
    .map((member) => {
      return <Member>cacheMembers[member];
    })
    .filter(Boolean);
}
