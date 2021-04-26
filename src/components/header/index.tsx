import { useCallback, useContext, useMemo } from 'react';
import { NavLink, Link, NavLinkProps } from 'react-router-dom';
import classnames from 'classnames';
import { Avatar, Dropdown, Menu } from 'antd';
import { UserContext } from '@/context';
import logo from '@assets/logo.png';
import styles from './header.module.scss';
import { axios, localStorage } from '@utils';
import { ROUTES } from '@consts';

export default function AppHeader() {
  const loginUser = useContext(UserContext);
  const logout = useCallback(async () => {
    await axios.get('/api/auth/v1/logout', { baseURL: process.env.REACT_APP_LOGIN_DOMAIN });

    localStorage.clear('token');
  }, []);
  const dropownOverlay = useMemo(() => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={logout}>
          退出登陆
        </Menu.Item>
      </Menu>
    );
  }, [logout]);

  const indexNavIsActive: NavLinkProps['isActive'] = useCallback((match, location) => {
    if (match) {
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
          <NavLink to="/scenes" isActive={indexNavIsActive} className={styles.nav} activeClassName={styles.active}>
            场景管理
          </NavLink>
          <NavLink to={ROUTES.LOGIN} className={styles.nav} activeClassName={styles.active}>
            模版中心
          </NavLink>
          <NavLink to="/system" className={styles.nav} activeClassName={styles.active}>
            系统管理
          </NavLink>
        </div>

        <div>
          {loginUser ? (
            <Dropdown overlay={dropownOverlay} getPopupContainer={(c) => c} placement="bottomRight">
              <div className={styles.user}>
                <Avatar className={styles.avatar} size={32} src={loginUser.avatar}></Avatar>
                <div className={styles.name}>{loginUser.cName}</div>
              </div>
            </Dropdown>
          ) : (
            <NavLink to="/login">登陆</NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
