import { memo, useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import classnames from "classnames";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Loading } from "@common/components";
import { runtimeAxios } from "@utils";
import { AppSchema } from "@schema/app";
import { MAIN_CONTENT_CLASSNAME, dynamicRoutes } from "@consts";
import { userSelector } from "@/store/user";
import AppCard from "@components/app-card";
import styles from "./index.module.scss";

function formatTime(time: Date): string {
  const hours = time.getHours();

  if (hours > 12 && hours < 24) {
    return "下午";
  }

  return "上午";
}

function App() {
  const loginUser = useSelector(userSelector);
  const [apps, setApps] = useState<AppSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await runtimeAxios.get<{ data: AppSchema[] }>("/app/list/all");

        setApps(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getPopupContainer = useMemo(() => {
    return () => {
      return containerRef.current!;
    };
  }, []);

  const handleClickCard = useMemoCallback((app: AppSchema) => {
    window.open(`/main${dynamicRoutes.toAppTaskCenter(String(app.id))}`);
  });

  return (
    <div
      ref={containerRef}
      id="easydock-apps-container"
      className={classnames(styles.container, MAIN_CONTENT_CLASSNAME)}
    >
      {loading && <Loading />}

      <div className={styles.welcome}>
        {loginUser.info && <div className={styles.title}>{`Hi ${loginUser.info.username}`}</div>}
        <div className={styles.time}>{`${formatTime(new Date())}好!`}</div>
      </div>
      <div>
        <div className={styles.apps}>
          {apps.map((app) => (
            <AppCard containerId="easydock-apps-container" data={app} key={app.id} onClick={handleClickCard}>
              {app.remark && app.remark.length > 30 ? (
                <Tooltip title={app.remark} placement="topLeft" getPopupContainer={getPopupContainer}>
                  <div className={styles.remark}>{app.remark}</div>
                </Tooltip>
              ) : (
                <div className={styles.remark}>{app.remark || "这是一个应用"}</div>
              )}
            </AppCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(App);
