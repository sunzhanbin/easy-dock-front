import { useParams } from 'react-router';
import appConfig from '@/init';

export default function useAppId() {
  const { appId } = useParams<{ appId: string }>();

  return appConfig.appId || appId;
}
