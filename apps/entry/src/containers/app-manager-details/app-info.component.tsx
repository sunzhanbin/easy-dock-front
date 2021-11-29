import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useAppSelector } from "@/store";
import {
  useFetchWorkspaceListQuery,
  useModifyAppStatusMutation,
} from "@/http/app-manager.hooks";
import {
  selectCurrentWorkspaceId,
  selectProjectId,
} from "@/views/app-manager/index.slice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { workspaceShape } from "@utils/types";

const AppInfoComponent: React.FC = () => {
  const projectId = useAppSelector(selectProjectId);
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);

  const { workspace } = useFetchWorkspaceListQuery(projectId, {
    selectFromResult: ({ data }) => ({
      workspace: data?.find(
        (item: workspaceShape) => item.id === Number(workspaceId)
      ),
    }),
  });

  const [modifyAppStatus] = useModifyAppStatusMutation();

  const handleModifyAppStatus = useCallback(() => {
    modifyAppStatus({ id: workspaceId, status: 1 });
  }, [modifyAppStatus, workspaceId]);

  const handlePreview = useCallback(() => {
    console.log("preview");
  }, []);

  return (
    <React.Fragment>
      这里是应用详情:: {workspace.name}
      <br />
      <Link to={`../${workspaceId}`}>编辑应用</Link>
      <br />
      <Button onClick={handleModifyAppStatus}>修改状态</Button>
      <Button onClick={handlePreview}>预览</Button>
      <CopyToClipboard text={"www.exmple.com"}>
        <Button>复制链接</Button>
      </CopyToClipboard>
    </React.Fragment>
  );
};

export default AppInfoComponent;
