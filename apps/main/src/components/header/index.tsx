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
  const canGoBuilder = useMemo(() => {
    if (user && user.info && user.info.power) {
      const { power } = user.info;
      if (
        (power & RoleEnum.ADMIN) === RoleEnum.ADMIN ||
        (power & RoleEnum.PROJECT_MANAGER) === RoleEnum.PROJECT_MANAGER ||
        (power & RoleEnum.APP_MANAGER) === RoleEnum.APP_MANAGER
      ) {
        return true;
      }
      return false;
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
              <a href={ROUTES.BUILDER} target="_blank" className={styles.appClient}>
                <Icon type="yingyonduandinglan" className={styles.icon} />
                <span className={styles.text}>构建端</span>
              </a>
            ) : null
          ) : (
            <a href={ROUTES.INDEX} target="_blank" className={styles.appClient}>
              <Icon type="yingyonduandinglan" className={styles.icon} />
              <span className={styles.text}>应用端</span>
            </a>
          )}
          <UserComponent />
        </div>
      </div>
    </div>
  );
}
