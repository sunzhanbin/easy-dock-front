import { ReactNode, memo } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { getSceneImageUrl } from '@utils';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';

import type { AppSchema } from '@schema/app';

interface AppCardProps {
  data: AppSchema;
  containerId: string;
  onClick?(data: AppSchema): void;
  className?: string;
  children?: ReactNode;
}

function AppCard(props: AppCardProps) {
  const { data, containerId, onClick, className, children } = props;
  const getPopupContainer = useMemoCallback(() => {
    return document.getElementById(containerId)!;
  });

  const handleClick = useMemoCallback(() => {
    if (onClick) {
      onClick(data);
    }
  });

  return (
    <div className={classnames(styles.card, className)} onClick={handleClick}>
      <img src={getSceneImageUrl(data.icon)} alt="iamge" />
      <div className={styles.content}>
        {data.name.length > 15 ? (
          <Tooltip title={data.name} getPopupContainer={getPopupContainer} placement="topLeft">
            <div className={styles.title}>{data.name}</div>
          </Tooltip>
        ) : (
          <div className={styles.title}>{data.name}</div>
        )}

        {children}
      </div>
    </div>
  );
}

export default memo(AppCard);
