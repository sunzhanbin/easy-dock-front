import { ReactNode, memo } from "react";
import { Tooltip } from "antd";
import classnames from "classnames";
import { getSceneImageUrl } from "@utils/utils";
import useMemoCallback from "@common/hooks/use-memo-callback";
import "@components/app-card/index.style.scss";
import { AppSchema } from "@utils/types";

interface AppCardProps {
  data: AppSchema;
  containerId: string;
  className?: string;
  children?: ReactNode;

  onClick?(data: AppSchema): void;
}

function AppCard(props: AppCardProps) {
  const { data, containerId, onClick, className, children } = props;
  const getPopupContainer = useMemoCallback(() => {
    return document.getElementById(containerId)!;
  });
  const handleClick = useMemoCallback(() => {
    onClick && onClick(data);
  });

  return (
    <div className={classnames("card", className)} onClick={handleClick}>
      <img src={getSceneImageUrl(data.icon)} alt="" />
      <div className="content">
        {data.name.length > 15 ? (
          <Tooltip title={data.name} getPopupContainer={getPopupContainer} placement="topLeft">
            <div className="title">{data.name}</div>
          </Tooltip>
        ) : (
          <div className="title">{data.name}</div>
        )}
        {children}
      </div>
    </div>
  );
}

export default memo(AppCard);
