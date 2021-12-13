import { memo, FC, useState, useMemo, useEffect } from "react";
import classNames from "classnames";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Icon, Text } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { useAppSelector } from "@/store";
import { selectName } from "@/views/workspace/index.slice";
import "./app-manager-header.style.scss";
import { selectCurrentWorkspaceId } from "@/views/app-manager/index.slice";
import { useWorkspaceDetailQuery } from "@/http";

interface EditHeaderProps {
  className?: string;
}

interface NavItem {
  key: string;
  title: string;
}

const AppManagerHeader: FC<EditHeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const { data: workspace } = useWorkspaceDetailQuery(workspaceId);
  const [activeNav, setActiveNav] = useState<string>("edit");
  const navList = useMemo<NavItem[]>(() => {
    return [{ key: "edit", title: "应用设计" }];
  }, []);
  const handleBack = useMemoCallback(() => {
    navigate(`/app-manager`);
  });
  useEffect(() => {
    if (workspace?.name) {
      // setName(workspace.name);
    }
  }, [workspace?.name]);
  return (
    <div className={classNames("app-manager-header", className && className)}>
      <div className="left" onClick={handleBack}>
        <Icon type="fanhui" className="back" />
        <div className="workspace-name">
          <Text text={workspace?.name} />
        </div>
      </div>
      <div className="nav-list">
        {navList.map(({ key, title }) => {
          return (
            <div
              key={key}
              className={classNames("nav-item", activeNav === key && "active")}
              onClick={() => setActiveNav(key)}
            >
              {title}
            </div>
          );
        })}
      </div>
      <div className="right">
        <div className="preview">
          <Icon type="yulan" className="icon" />
          <div className="text">预览</div>
        </div>
        <Button className="save" size="large" type="default" ghost>
          保存
        </Button>
        <Button
          className="publish"
          size="large"
          type="primary"
          icon={<Icon type="fabu" />}
        >
          发布
        </Button>
      </div>
    </div>
  );
};

export default memo(AppManagerHeader);
