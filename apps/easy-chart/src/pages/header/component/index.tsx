import React, { memo, ReactNode, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { Icon } from '@common/components';
import styles from './index.module.scss';

interface HeaderProps {
  backText: string;
  backClassName?: string;
  children?: ReactNode;
  className?: string;
  goBack?: () => void;
}

function Header(props: HeaderProps) {
  const history = useHistory();
  const { backText, backClassName, children, className, goBack } = props;
  const handelClick = useCallback(() => {
    if (goBack) {
      goBack();
    } else {
      history.goBack();
    }
  }, [history, goBack]);
  return (
    <div className={classnames(styles.header, className)}>
      <div className={classnames(styles.back, backClassName)} onClick={handelClick}>
        <Icon className={styles.icon} type="fanhui" />
        {backText}
      </div>
      {children}
    </div>
  );
}

export default memo(Header);
