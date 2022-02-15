import { memo, useEffect, useRef, useState } from "react";
import { loadMicroApp } from "qiankun";
import Loading from "@components/loading";
import classnames from "classnames";
import useMatchRoute from "@hooks/use-match-route";
import styles from "./index.module.scss";

interface MicroAppProps {
  name: string;
  entry: string;
  className?: string;
  basename?: string;
  extra?: any;
}

function MicroApp(props: MicroAppProps) {
  const { name, entry, className, basename, extra } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const matchedRoute = useMatchRoute();

  useEffect(() => {
    if (containerRef.current) {
      const app = loadMicroApp({
        name,
        entry: entry + `?ts=${Date.now()}`,
        container: containerRef.current,
        props: {
          basename: basename || `/main${matchedRoute}`,
          ...extra,
        },
      });

      app.mountPromise.finally(() => {
        // 防止页面跳走后才加载成功时setstate的警告;
        if (containerRef.current) {
          setLoading(false);
        }
      });

      return () => {
        app.unmount();
      };
    }
  }, [name, entry, basename, matchedRoute, extra]);
  // 暂时解决富文本编辑器图片上传弹窗问题
  useEffect(() => {
    const targetNode = document.body;
    const config = { attributes: false, childList: true, subtree: false };
    const callback = (mutationsList: MutationRecord[]) => {
      mutationsList.forEach((item) => {
        if (item.addedNodes.length > 0 && (item.addedNodes[0] as HTMLDivElement).className === "bf-modal-root") {
          const modal = item.addedNodes[0];
          modal.addEventListener("click", (e) => {
            const classList = (e.target as HTMLElement).classList;
            if (
              classList.contains("bfi-close") ||
              classList.contains("button-cancel") ||
              classList.contains("button-insert")
            ) {
              // 关闭弹窗
              targetNode.removeChild(modal);
            }
          });
        }
      });
    };
    const observer = new MutationObserver(callback);
    // 监听弹窗进入dom
    observer.observe(targetNode, config);
    return () => {
      // 取消监听
      observer.disconnect();
    };
  }, []);

  return (
    <div className={classnames(styles.container, className)}>
      {loading && <Loading />}
      <div className={styles.content} ref={containerRef}></div>
    </div>
  );
}

export default memo(MicroApp);
