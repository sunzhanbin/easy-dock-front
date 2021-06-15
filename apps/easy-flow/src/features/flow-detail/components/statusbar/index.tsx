import { ReactNode, memo, useMemo } from 'react';
import classnames from 'classnames';
import { NodeStatusType } from '@type/flow';
import styles from './index.module.scss';
import appConfig from '@/init';

interface StatusBarProps {
  status: NodeStatusType;
  children?: ReactNode;
  className?: string;
}

function StatusBar(props: StatusBarProps) {
  const { status, children, className } = props;
  const { image, styleName } = useMemo(() => {
    let image = '';
    let styleName = '';

    if (status === NodeStatusType.Processing) {
      image = `${appConfig.publicPath}/images/flow-detail/processing.png`;
      styleName = styles.processing;
    } else if (status === NodeStatusType.Undo) {
      image = `${appConfig.publicPath}/images/flow-detail/undo.png`;
      styleName = styles.undo;
    } else if (status === NodeStatusType.Terminated) {
      image = `${appConfig.publicPath}/images/flow-detail/terminated.png`;
      styleName = styles.terminated;
    } else if (status === NodeStatusType.Revert) {
      image = `${appConfig.publicPath}/images/flow-detail/revert.png`;
      styleName = styles.revert;
    } else if (status === NodeStatusType.Finish) {
      image = `${appConfig.publicPath}/images/flow-detail/finish.png`;
      styleName = styles.finish;
    }

    return { image, styleName };
  }, [status]);

  return (
    <div className={classnames(styles.statusbar, styleName, className)}>
      <div className={styles.content}>
        <img className={styles.image} src={image} alt="状态图" />
        {children}
      </div>
    </div>
  );
}

export default memo(StatusBar);
