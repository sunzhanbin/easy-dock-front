import { Route, NavLink } from 'react-router-dom';
import classnames from 'classnames';
import useMatchRoute from '@hooks/use-match-route';
// import NotFound from '@components/not-found';
import { MAIN_CONTENT_CLASSNAME } from '@consts';
import ROUTES from '@utils/route';
import styles from './index.module.scss';

import OrchMicro from './orch';

export default function Integration() {
  const mathedRoute = useMatchRoute();

  return (
    <div className={styles.integration}>
      <div className={classnames(MAIN_CONTENT_CLASSNAME, styles.header)}>
        <NavLink to={ROUTES.INTEGRATION_DATA_MANAGE} className={styles.nav} activeClassName={styles.active}>
          数据管理
        </NavLink>
        <NavLink to={ROUTES.INTEGRATION_ORCH_INTERFACE_LIST} className={styles.nav} activeClassName={styles.active}>
          API接口管理
        </NavLink>
        <NavLink to={ROUTES.INTEGRATION_MODEL_MANAGE} className={styles.nav} activeClassName={styles.active}>
          数据模型管理
        </NavLink>
      </div>
      <Route path={ROUTES.INTEGRATION_ORCH_INDEX} component={OrchMicro}></Route>
    </div>
  );
}
