import { Route, NavLink } from 'react-router-dom';
import classnames from 'classnames';
import useMatchRoute from '@hooks/use-match-route';
// import NotFound from '@components/not-found';
import { MAIN_CONTENT_CLASSNAME } from '@consts';
import styles from './index.module.scss';

import OrchMicro from './orch';

export default function Integration() {
  const mathedRoute = useMatchRoute();

  return (
    <div className={styles.integration}>
      <div className={classnames(MAIN_CONTENT_CLASSNAME, styles.header)}>
        <NavLink to={`${mathedRoute}/data-manage`} className={styles.nav} activeClassName={styles.active}>
          数据管理
        </NavLink>
        <NavLink to={`${mathedRoute}/orch/interface-manage`} className={styles.nav} activeClassName={styles.active}>
          API接口管理
        </NavLink>
        <NavLink to={`${mathedRoute}/model-manage`} className={styles.nav} activeClassName={styles.active}>
          数据模型管理
        </NavLink>
      </div>
      <Route path={`${mathedRoute}/orch`} component={OrchMicro}></Route>
    </div>
  );
}
