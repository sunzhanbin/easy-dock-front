import { useAppSelector } from '@/app/hooks';
import { appSelector } from '@/features/task-center/taskcenter-slice';

export default function useApp() {
  return useAppSelector(appSelector);
}
