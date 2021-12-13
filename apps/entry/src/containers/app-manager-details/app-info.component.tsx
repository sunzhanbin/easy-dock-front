import React, { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useAppSelector } from "@/store";
import {
  useFetchWorkspaceListQuery,
  useModifyAppStatusMutation,
  useWorkspaceDetailQuery,
  useFetchsubAppListQuery,
} from "@http/app-manager.hooks";
import { selectCurrentWorkspaceId } from "@views/app-manager/index.slice";
import { Icon } from "@common/components";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { workspaceShape } from "@utils/types";

import "@containers/app-manager-details/app-info.style";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { selectProjectId } from "@/views/home/index.slice";

const AppInfoComponent: React.FC = () => {
  const projectId = useAppSelector(selectProjectId);
  const navigate = useNavigate();
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const [modifyAppStatus] = useModifyAppStatusMutation();
  const { data: workspace } = useWorkspaceDetailQuery(workspaceId);
  const { data: subAppList } = useFetchsubAppListQuery(workspaceId);
  const hasPublished = useMemo(() => workspace?.extension, [workspace]);
  const subAppCount = useMemo(() => subAppList?.length || 0, [subAppList]);

  const handleModifyAppStatus = useCallback(() => {
    modifyAppStatus({ id: workspaceId, status: 1 });
  }, [modifyAppStatus, workspaceId]);

  const handlePreview = useCallback(() => {
    console.log("handlePreview");
  }, []);

  const handleCreate = useMemoCallback(() => {
    navigate(`/app-manager/${workspaceId}`);
  });

  return (
    <div className="app-info-component">
      {/* 这里是应用详情:: {workspace.name}
      <br />
      <Link to={`../${workspaceId}`}>编辑应用</Link>
      <br />
      <Button onClick={handleModifyAppStatus}>修改状态</Button>
      <Button onClick={handlePreview}>预览</Button>
      <CopyToClipboard text={"www.exmple.com"}>
        <Button>复制链接</Button>
      </CopyToClipboard> */}
      <div className="header">
        <div className="base-info">
          <span className="name">{workspace?.name}</span>
          <span className="count">({subAppCount})</span>
        </div>
        {!hasPublished && (
          <Button
            className="create"
            size="large"
            type="default"
            ghost
            icon={<Icon type="xinzeng" className="icon" />}
            onClick={handleCreate}
          >
            创建应用编排
          </Button>
        )}
      </div>
      {hasPublished && <div className="content"></div>}
    </div>
  );
};

export default AppInfoComponent;
