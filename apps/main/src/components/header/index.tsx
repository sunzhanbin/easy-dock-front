import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import logo from '@assets/logo.png';
import { Icon } from '@common/components';
import UserComponent from './user';
import styles from './index.module.scss';

interface AppHeaderProps {
  children?: ReactNode;
}

export default function AppHeader({ children }: AppHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={classnames('easy-dock-content', styles.header)}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="logo" />
        </Link>

        {children}

        <div className={styles.right}>
          <a href="/" target="_blank" className={styles.appClient}>
            <Icon type="yingyonduandinglan" className={styles.icon} />
            <span className={styles.text}>应用端</span>
          </a>
          <UserComponent />
        </div>
      </div>
    </div>
  );
}
