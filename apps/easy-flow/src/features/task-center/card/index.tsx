import { memo, useCallback, useMemo, FC } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { useHistory, useLocation } from "react-router-dom";
import { dynamicRoutes } from "@/consts/route";
import appConfig from "@/init";

const Card: FC<{ id: number; name: string; className?: string }> = ({ id, name, className }) => {
  const history = useHistory();
  const location = useLocation();
  const handleClick = useCallback(() => {
    const path = dynamicRoutes.toStartFlow(id);
    history.push(path);
  }, [id, history]);
  const theme = useMemo<string>(() => {
    // 以iframe方式接入,参数在location中
    if (location.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get("theme") || "light";
    }
    // 以微前端方式接入,参数在extra中
    if (appConfig?.extra?.theme) {
      return appConfig.extra.theme;
    }
    return "light";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, appConfig?.extra?.theme]);

  const imageMap = useMemo(() => {
    const publicPath = appConfig.publicPath.replace(/\/$/, "");
    return `${publicPath}/images/flow-detail/${theme}-flow-small.png`;
  }, [theme]);
  return (
    <div className={classNames(styles.container, className)} onClick={handleClick}>
      <div className={styles.left}>
        <img src={imageMap} alt="图片" className={styles.image} />
      </div>
      <div className={styles.right}>{name}</div>
    </div>
  );
};

export default memo(Card);
