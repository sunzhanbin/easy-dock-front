import { useCallback, useContext, useMemo } from 'react';
import { NavLink, Link, NavLinkProps, useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { Avatar, Dropdown, Menu } from 'antd';
import { localStorage } from '@common/utils';
import { UserContext } from '@/context';
import { axios } from '@utils';
import { ROUTES, envs } from '@consts';
import logo from '@assets/logo.png';
import styles from './header.module.scss';

export default function AppHeader() {
  const loginUser = useContext(UserContext);
  const history = useHistory();
  const logout = useCallback(async () => {
    await axios.get('/api/auth/v1/logout', { baseURL: envs.COMMON_LOGIN_DOMAIN });

    delete axios.defaults.headers.auth;
    localStorage.clear('token');
    history.replace(ROUTES.LOGIN);
  }, [history]);

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
          {loginUser ? (
            <div className={styles.user}>
              <Dropdown overlay={dropownOverlay} getPopupContainer={(c) => c} placement="bottomCenter">
                <div className={styles.avatar}>
                  <Avatar size={32} src={loginUser.avatar} />
                </div>
              </Dropdown>
              <div className={styles.name}>{loginUser.cName}</div>
            </div>
          ) : (
            <NavLink to={ROUTES.LOGIN}>登陆</NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
