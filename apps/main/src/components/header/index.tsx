import { useCallback } from 'react';
import { NavLink, Link, NavLinkProps } from 'react-router-dom';
import classnames from 'classnames';
import { ROUTES } from '@consts';
import logo from '@assets/logo.png';
import UserComponent from './user';
import styles from './index.module.scss';

export default function AppHeader() {
  const indexNavIsActive: NavLinkProps['isActive'] = useCallback((match, location) => {
    if (match || /^\/scenes-detail\/\d+/.test(location.pathname)) {
      return true;
    } else if (location.pathname === '/') {
      return true;
    } else {
      return false;
    }
  }, []);

  return (
    <div className={styles.header}>
      <div className={classnames('easy-dock-content', styles.content)}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="logo" />
        </Link>

        <div className={styles.navs}>
          <NavLink
            to={ROUTES.SCENE_MANAGE}
            isActive={indexNavIsActive}
            className={styles.nav}
            activeClassName={styles.active}
          >
            应用管理
          </NavLink>
          <NavLink to={ROUTES.TMPLATE_CENTER} className={styles.nav} activeClassName={styles.active}>
            模版中心
          </NavLink>
          <NavLink to={ROUTES.SYSTEM_MANAGE} className={styles.nav} activeClassName={styles.active}>
            系统管理
          </NavLink>
        </div>

        <div>
          <UserComponent />
        </div>
      </div>
    </div>
  );
}
