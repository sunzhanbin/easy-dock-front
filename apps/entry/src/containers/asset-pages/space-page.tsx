import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAppSelector } from '@/store';
import { useGetHoloSceneIdMutation, useWorkspaceRuntimeDetailQuery } from '@http/app-manager.hooks';
import { selectCurrentId } from '@views/workspace/index.slice';
import { findItem } from '@utils/utils';
import { SPACE_ENTRY } from '@/consts';
import './space-page.style.scss';

const SpaceMicroPage = () => {
  const { workspaceId } = useParams();
  const selectedKey = useAppSelector(selectCurrentId);
  const { menu } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      menu: data?.extension?.meta?.menuList || [],
    }),
  });
  const [getHoloSceneId] = useGetHoloSceneIdMutation();
  const appInfo = useMemo(() => {
    const menuInfo = findItem(selectedKey, menu);
    return {
      subAppId: menuInfo?.form?.assetConfig?.subAppId,
      subAppType: menuInfo?.form?.assetConfig?.subAppType,
    };
  }, [selectedKey, menu]);
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    if (appInfo?.subAppId) {
      const { subAppId } = appInfo;
      getHoloSceneId(+subAppId).then((res) => {
        const data = (res as { data: any }).data;
        const id = data?.refId;
        const token = data?.token;
        if (!id || !token) return;
        const src = `${SPACE_ENTRY}/preview.html?token=${token}&id=${id}`;
        setSrc(src);
      });
    }
  }, [appInfo?.subAppId]);

  return (
    <div className="space-page">
      <iframe className="iframe" src={src} frameBorder={0}></iframe>
    </div>
  );
};

export default SpaceMicroPage;
