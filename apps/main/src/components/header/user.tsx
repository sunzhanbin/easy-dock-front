import { memo, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Auth from '@enc/sso';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Menu } from 'antd';
import classNames from 'classnames';
import { Avatar } from '@common/components';
import { Icon } from '@common/components';
import { userSelector, logout } from '@/store/user';
import { ROUTES } from '@consts';
import { RoleEnum } from '@/schema/app';
import styles from './index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';

function HeaderUser() {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleLogin = useMemoCallback(async () => {
    if (window.Auth) {
      await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
    } else {
      await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
    }
  });
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const user = useSelector(userSelector);
  const handleGoAuth = useCallback(() => {
    history.push(ROUTES.USER_MANAGER_AUTH);
  }, [history]);
  // 当前角色是否是超管
  const isAdmin = useMemo(() => {
    const power = user.info?.power || 0;
    return (power & RoleEnum.ADMIN) === RoleEnum.ADMIN;
  }, [user]);
  const dropownOverlay = useMemo(() => {
    return (
      <Menu>
        {isAdmin && (
          <>
            <Menu.Item key="auth" onClick={handleGoAuth} className={styles.menuItem}>
              <span>
                <Icon type="quanxianshezhi" className={styles.icon} />
                权限设置
              </span>
            </Menu.Item>
            <Menu.Item key="line" className={classNames(styles.menuItem, styles.line)}></Menu.Item>
          </>
        )}
        <Menu.Item key="logout" onClick={handleLogout} className={styles.menuItem}>
          <span>
            <Icon type="tuichudenglu" className={styles.icon} />
            退出登录
          </span>
        </Menu.Item>
      </Menu>
    );
  }, [isAdmin, handleGoAuth, handleLogout]);

  return (
    <>
      {user.info ? (
        <Dropdown overlay={dropownOverlay} getPopupContainer={(c) => c} placement="bottomLeft">
          <div className={styles.user}>
            <div className={styles.avatar}>
              <Avatar round size={32} src={user.info.avatar} name={user.info.username} />
            </div>
            <div className={styles.name}>{user.info.username}</div>
          </div>
        </Dropdown>
      ) : (
        // <NavLink to={ROUTES.LOGIN}>登陆</NavLink>
        <div className={styles.login} onClick={handleLogin}>
          登录
        </div>
      )}
    </>
  );
}

export default memo(HeaderUser);
