import { useSelector } from 'react-redux';
import { flowDataSelector } from '../flow-slice';
import { Member } from '@type';

export default function useShowMembers(members: string[]) {
  const { cacheMembers } = useSelector(flowDataSelector);

  return members.map((member) => {
    return <Member>cacheMembers[member];
  });
}
