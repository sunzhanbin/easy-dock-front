import { ReactNode, memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { Icon } from '@common/components';
import styles from './index.module.scss';

interface DetailHeaderProps {
  backText: string;
  children?: ReactNode;
  className?: string;
  goBack?: Function;
}

function DetailHeader(props: DetailHeaderProps) {
  const history = useHistory();
  const { backText, children, className, goBack } = props;
  const handelClick = useCallback(() => {
    if (goBack) {
      goBack();
    } else {
      history.goBack();
    }
  }, [history, goBack]);
  return (
    <div className={classnames(styles.header, className)}>
      <div className={styles.back} onClick={handelClick}>
        <Icon className={styles.icon} type="fanhui" />
        {backText}
      </div>
      {children}
    </div>
  );
}

export default memo(DetailHeader);
