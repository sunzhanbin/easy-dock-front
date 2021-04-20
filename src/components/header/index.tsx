import { NavLink, Link } from 'react-router-dom';
import classnames from 'classnames';
import logo from '@assets/logo.png';
import styles from './header.module.scss';

export default function AppHeader() {
  return (
    <div className={styles.header}>
      <div className={classnames('easy-dock-content', styles.content)}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="logo" />
        </Link>

        <div className={styles.navs}>
          <NavLink to="/" className={styles.nav} activeClassName={styles.active}>
            场景管理
          </NavLink>
          <NavLink to="/tmpl" className={styles.nav} activeClassName={styles.active}>
            模版中心
          </NavLink>
          <NavLink to="/system" className={styles.nav} activeClassName={styles.active}>
            系统管理
          </NavLink>
        </div>
      </div>
    </div>
  );
}
