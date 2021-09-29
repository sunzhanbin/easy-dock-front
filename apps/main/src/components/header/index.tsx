import { ReactNode, useMemo } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import classnames from 'classnames';
import logo from '@assets/logo.png';
import { Icon } from '@common/components';
import UserComponent from './user';
import styles from './index.module.scss';
import { useAppSelector } from '@/hooks/use-redux';
import { userSelector } from '@/store/user';
import { RoleEnum } from '@/schema/app';
import { ROUTES } from '@consts';

interface AppHeaderProps {
  children?: ReactNode;
}

export default function AppHeader({ children }: AppHeaderProps) {
  const match = useRouteMatch();
  const user = useAppSelector(userSelector);
  // 是否有权限跳转到构建端,只有超管或者项目管理员、应用管理员才有权限
  const canGoBuilder = useMemo<boolean>(() => {
    if (user && user.info && user.info.power) {
      const { power } = user.info;
      return (
        (power & RoleEnum.ADMIN) === RoleEnum.ADMIN ||
        (power & RoleEnum.PROJECT_MANAGER) === RoleEnum.PROJECT_MANAGER ||
        (power & RoleEnum.APP_MANAGER) === RoleEnum.APP_MANAGER
      );
    }
    return false;
  }, [user]);
  // 是否有权限跳转到应用端,只有正常项目租户才有权限
  const canGoApp = useMemo(() => {
    if (user && user.info && user.info.power) {
      const { power } = user.info;
      return (power & RoleEnum.TENEMENT) === RoleEnum.TENEMENT;
    }
    return false;
  }, [user]);
  return (
    <div className={styles.container}>
      <div className={classnames('easy-dock-content', styles.header)}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="logo" />
        </Link>

        {children}

        <div className={styles.right}>
          {match.url === '/' ? (
            canGoBuilder ? (
              <a href={ROUTES.BUILDER} target="_blank" rel="noreferrer" className={styles.appClient}>
                <Icon type="yingyonduandinglan" className={styles.icon} />
                <span className={styles.text}>构建端</span>
              </a>
            ) : null
          ) : canGoApp ? (
            <a href={ROUTES.INDEX} target="_blank" rel="noreferrer" className={styles.appClient}>
              <Icon type="yingyonduandinglan" className={styles.icon} />
              <span className={styles.text}>应用端</span>
            </a>
          ) : null}
          <UserComponent />
        </div>
      </div>
    </div>
  );
}
