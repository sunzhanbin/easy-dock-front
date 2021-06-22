import { memo, useMemo, useCallback } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { useSelector } from 'react-redux';
import { Avatar } from '@common/components';
import { userSelector } from '@/store/user';
import { axios } from '@utils';
import { ROUTES, envs } from '@consts';
import { localStorage } from '@common/utils';
import styles from './index.module.scss';

function HeaderUser() {
  const history = useHistory();

  const logout = useCallback(async () => {
    await axios.get('/api/auth/v1/logout', { baseURL: envs.COMMON_LOGIN_DOMAIN });

    delete axios.defaults.headers.auth;
    localStorage.clear('token');
    history.replace(ROUTES.LOGIN);
  }, [history]);

  const user = useSelector(userSelector);
  const dropownOverlay = useMemo(() => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={logout}>
          退出登陆
        </Menu.Item>
      </Menu>
    );
  }, [logout]);

  return (
    <>
      {user.info ? (
        <div className={styles.user}>
          <Dropdown overlay={dropownOverlay} getPopupContainer={(c) => c} placement="bottomCenter">
            <div className={styles.avatar}>
              <Avatar round size={32} src={user.info.avatar} name={user.info.cName} />
            </div>
          </Dropdown>
          <div className={styles.name}>{user.info.cName}</div>
        </div>
      ) : (
        <NavLink to={ROUTES.LOGIN}>登陆</NavLink>
      )}
    </>
  );
}

export default memo(HeaderUser);
