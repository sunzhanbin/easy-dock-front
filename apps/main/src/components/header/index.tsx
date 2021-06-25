import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import logo from '@assets/logo.png';
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

        <div>
          <UserComponent />
        </div>
      </div>
    </div>
  );
}
