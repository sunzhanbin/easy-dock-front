import { memo, useMemo, useRef } from "react";
import { Tooltip } from "antd";
import classnames from "classnames";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Loading } from "@common/components";
import { AppSchema } from "@utils/types";
import AppCard from "@components/app-card";
import { useGetWorkspaceListQuery } from "@/http";
import "@containers/workspace-running/runtime-root.style.scss";
import { useAppSelector } from "@/store";
import { selectUserInfo } from "@views/home/index.slice";

function formatTime(time: Date): string {
  const hours = time.getHours();
  if (hours > 12 && hours < 24) {
    return "下午";
  }
  return "上午";
}

function RuntimeRoot() {
  const userInfo = useAppSelector(selectUserInfo);
  const { isLoading, data: apps } = useGetWorkspaceListQuery();
  const containerRef = useRef<HTMLDivElement>(null);

  const getPopupContainer = useMemo(() => {
    return () => containerRef.current!;
  }, []);

  const handleClickCard = useMemoCallback((app: AppSchema) => {
    window.open(`/workspace/${String(app.id)}`);
  });

  return (
    <div
      ref={containerRef}
      id="easydock-apps-container"
      className={classnames("runtime-container", "easy-dock-content")}
    >
      {isLoading && <Loading />}
      <div className="welcome">
        {<div className="title">{`Hi ${userInfo?.username}`}</div>}
        <div className="time">{`${formatTime(new Date())}好!`}</div>
      </div>
      <div>
        <div className="apps">
          {apps?.map((app) => (
            <AppCard containerId="easydock-apps-container" data={app} key={app.id} onClick={handleClickCard}>
              {app.remark && app.remark.length > 30 ? (
                <Tooltip title={app.remark} placement="topLeft" getPopupContainer={getPopupContainer}>
                  <div className="remark">{app.remark}</div>
                </Tooltip>
              ) : (
                <div className="remark">{app.remark || "这是一个应用"}</div>
              )}
            </AppCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(RuntimeRoot);
