import { memo, FC, useState, useMemo, useEffect } from "react";
import classNames from "classnames";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Icon, Text } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { useAppDispatch } from "@/store";
import { setName } from "@/views/workspace/index.slice";
import { useWorkspaceDetailQuery } from "@/http";
import "./app-manager-header.style.scss";

interface EditHeaderProps {
  className?: string;
}

interface NavItem {
  key: string;
  title: string;
}

const AppManagerHeader: FC<EditHeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const dispatch = useAppDispatch();
  const { data: workspace } = useWorkspaceDetailQuery(+(workspaceId as string));
  const [activeNav, setActiveNav] = useState<string>("edit");
  const navList = useMemo<NavItem[]>(() => {
    return [{ key: "edit", title: "应用设计" }];
  }, []);
  const handleBack = useMemoCallback(() => {
    navigate("/app-manager");
  });
  const handlePreview = useMemoCallback(() => {
    console.info("preview");
  });
  const handleSave = useMemoCallback(() => {
    console.info("save");
  });
  const handlePublish = useMemoCallback(() => {
    console.info("publish");
  });
  useEffect(() => {
    if (workspace?.name) {
      dispatch(setName(workspace.name));
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
        <div className="preview" onClick={handlePreview}>
          <Icon type="yulan" className="icon" />
          <div className="text">预览</div>
        </div>
        <Button
          className="save"
          size="large"
          type="default"
          ghost
          onClick={handleSave}
        >
          保存
        </Button>
        <Button
          className="publish"
          size="large"
          type="primary"
          icon={<Icon type="fabu" />}
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
    </div>
  );
};

export default memo(AppManagerHeader);
