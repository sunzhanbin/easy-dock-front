import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { useWorkspaceDetailQuery, useFetchSubAppListQuery } from "@http/app-manager.hooks";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import "@containers/app-manager-details/app-info.style";

const AppInfoComponent: React.FC = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { data: workspace } = useWorkspaceDetailQuery(Number(workspaceId), { skip: !workspaceId });
  const { data: subAppList } = useFetchSubAppListQuery(Number(workspaceId), { skip: !workspaceId });
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
