import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useAppSelector } from "@/store";
import {
  useModifyAppStatusMutation,
  useWorkspaceDetailQuery,
  useFetchSubAppListQuery,
} from "@http/app-manager.hooks";
import { selectCurrentWorkspaceId } from "@views/app-manager/index.slice";
import { Icon } from "@common/components";

import "@containers/app-manager-details/app-info.style";
import useMemoCallback from "@common/hooks/use-memo-callback";

const AppInfoComponent: React.FC = () => {
  const navigate = useNavigate();
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const [modifyAppStatus] = useModifyAppStatusMutation();
  const { data: workspace } = useWorkspaceDetailQuery(workspaceId);
  const { data: subAppList } = useFetchSubAppListQuery(workspaceId);
  const hasPublished = useMemo(() => workspace?.extension, [workspace]);
  const subAppCount = useMemo(() => subAppList?.length || 0, [subAppList]);

  const handleCreate = useMemoCallback(() => {
    navigate(`/app-manager/${workspaceId}`);
  });

  return (
    <div className="app-info-component">
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
