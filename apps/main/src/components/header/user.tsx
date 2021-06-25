import { memo, useMemo, useCallback } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from '@common/components';
import { userSelector, logout } from '@/store/user';
import { ROUTES } from '@consts';
import styles from './index.module.scss';

function HeaderUser() {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleLogout = useCallback(async () => {
    const logoutResponse = await dispatch(logout());

    if (logoutResponse.meta.requestStatus === 'rejected') {
      return;
    }

    history.replace(ROUTES.LOGIN + `?redirect=${encodeURIComponent(window.location.href)}`);
  }, [history, dispatch]);

  const user = useSelector(userSelector);
  const dropownOverlay = useMemo(() => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={handleLogout}>
          退出登陆
        </Menu.Item>
      </Menu>
    );
  }, [handleLogout]);

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
        <NavLink to={ROUTES.LOGIN}>登陆</NavLink>
      )}
    </>
  );
}

export default memo(HeaderUser);
