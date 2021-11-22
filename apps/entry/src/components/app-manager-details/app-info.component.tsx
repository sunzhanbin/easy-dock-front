import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useFetchWorkspaceListQuery, useModifyAppStatusMutation } from '@/http/app-manager.hooks';
import { selectCurrentWorkspaceId, selectProjectId } from '@/views/app-manager/index.slice';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { workspaceShape } from '@utils/types';
import { useCallback } from 'react';

const AppInfoComponent = () => {
  const projectId = useSelector(selectProjectId);
  const workspaceId = useSelector(selectCurrentWorkspaceId);

  const { workspace } = useFetchWorkspaceListQuery(projectId, {
    selectFromResult: ({data}) => ({
      workspace: data?.find((item: workspaceShape) => item.id === Number(workspaceId))
    })
  });

  const [ modifyAppStatus] = useModifyAppStatusMutation();

  const handleModifyAppStatus = useCallback(() => {
    modifyAppStatus({id: workspaceId, status: 1})
  }, [modifyAppStatus, workspaceId])

  const handlePreview = useCallback(() => {}, [])

  return (
    <>
      这里是应用详情:: {workspace.name}
      <br />
      <Button onClick={handleModifyAppStatus}>修改状态</Button>
      <Button onClick={handlePreview}>预览</Button>
      <CopyToClipboard text={"www.exmple.com"}>
          <Button>复制链接</Button>
      </CopyToClipboard>
    </>
  )
}

export default AppInfoComponent;