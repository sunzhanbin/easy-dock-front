import { useMemo } from "react";
import { Route, NavLink, useLocation } from "react-router-dom";
import classnames from "classnames";
import { MAIN_CONTENT_CLASSNAME, ROUTES } from "@consts";
import OrchMicro from "./orch";
import styles from "./index.module.scss";

export default function Integration() {
  const { pathname } = useLocation();
  const showHeader = useMemo(() => {
    return [
      ROUTES.INTEGRATION_DATA_MANAGE,
      ROUTES.INTEGRATION_ORCH_INTERFACE_LIST,
      ROUTES.INTEGRATION_MODEL_MANAGE,
    ].find((route) => pathname === route);
  }, [pathname]);

  return (
    <div className={styles.integration}>
      {showHeader && (
        <div className={classnames(MAIN_CONTENT_CLASSNAME, styles.header)}>
          <NavLink
            to={ROUTES.INTEGRATION_DATA_MANAGE}
            className={styles.nav}
            activeClassName={styles.active}
          >
            数据管理
          </NavLink>
          <NavLink
            to={ROUTES.INTEGRATION_ORCH_INTERFACE_LIST}
            className={styles.nav}
            activeClassName={styles.active}
          >
            API接口管理
          </NavLink>
          <NavLink
            to={ROUTES.INTEGRATION_MODEL_MANAGE}
            className={styles.nav}
            activeClassName={styles.active}
          >
            数据模型管理
          </NavLink>
        </div>
      )}
      <div className={styles.content}>
        <Route path={ROUTES.INTEGRATION_ORCH_INDEX} component={OrchMicro}></Route>
      </div>
    </div>
  );
}
