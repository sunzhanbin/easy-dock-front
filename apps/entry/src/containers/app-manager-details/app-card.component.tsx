import { memo, FC } from "react";
import classNames from "classnames";
import "./app-card.style.scss";
import { SubAppInfo } from "@/consts";

interface AppCardProps {
  subApp: SubAppInfo;
  className?: string;
}

const AppCard: FC<AppCardProps> = ({ subApp, className }) => {
  const { id, name, status, type, version } = subApp;

  return (
    <div className={classNames("app-card-container", className && className)}>
      <div className="app-card-base"></div>
      <div className="app-card-more"></div>
    </div>
  );
};

export default memo(AppCard);
