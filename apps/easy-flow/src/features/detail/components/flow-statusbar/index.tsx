import { ReactNode, memo, useMemo, useRef } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import appConfig from '@/init';
import { timeDiff } from '@utils';
import { Icon, Text } from '@common/components';
import { NodeStatusType, FlowInstance } from '@type/detail';
import styles from './index.module.scss';

interface CellProps {
  title: string | ReactNode;
  icon?: string;
  desc: string | ReactNode;
  getContainer?(): HTMLElement;
}

const Cell = memo(function Cell(props: CellProps) {
  const { title, icon, desc, getContainer } = props;

  return (
    <div className={styles.cell}>
      {icon && <Icon className={styles['cell-icon']} type={icon} />}
      <div className={styles['cell-content']}>
        <Text className={styles['cell-title']} getContainer={getContainer} placement="bottomLeft">
          {title}
        </Text>
        <div className={styles['cell-desc']}>{desc}</div>
      </div>
    </div>
  );
});

interface StatusBarProps {
  flowIns: FlowInstance;
  showCurrentProcessor?: boolean;
  className?: string;
}

function StatusBar(props: StatusBarProps) {
  const { flowIns, showCurrentProcessor, className } = props;
  const status = flowIns.state;
  const containerRef = useRef<HTMLDivElement>(null);
  const { image, styleName } = useMemo(() => {
    let image = '';
    let styleName = '';
    const publicPath = appConfig.publicPath.replace(/\/$/, '');

    if (status === NodeStatusType.Processing) {
      image = `${publicPath}/images/flow-detail/processing.png`;
      styleName = styles.processing;
    } else if (status === NodeStatusType.Undo) {
      image = `${publicPath}/images/flow-detail/undo.png`;
      styleName = styles.undo;
    } else if (status === NodeStatusType.Terminated) {
      image = `${publicPath}/images/flow-detail/terminated.png`;
      styleName = styles.terminated;
    } else if (status === NodeStatusType.Revert) {
      image = `${publicPath}/images/flow-detail/revert.png`;
      styleName = styles.revert;
    } else if (status === NodeStatusType.Finish) {
      image = `${publicPath}/images/flow-detail/finish.png`;
      styleName = styles.finish;
    }

    return { image, styleName };
  }, [status]);

  const getContainer = useMemo(() => {
    return () => containerRef.current!;
  }, []);

  // 渲染statusbar内容
  const content = useMemo(() => {
    const trackNode = (
      <div className={styles.track}>
        <span>流程跟踪</span>
        <Icon type="jinru" />
      </div>
    );

    // 办结状态显示
    if (flowIns.state === NodeStatusType.Finish) {
      return (
        <div className={classnames(styles.status, styles.finish)}>
          <Cell title={timeDiff(flowIns.endTime - flowIns.applyTime)} desc="流程耗时" />

          <div>{trackNode}</div>
        </div>
      );
    }

    const trackCell = (
      <Cell
        title={<div className={styles['time-used']}>{`流程用时 ${timeDiff(Date.now() - flowIns.applyTime)}`}</div>}
        desc={trackNode}
      />
    );

    // 显示当前处理人
    if (showCurrentProcessor && flowIns.state !== NodeStatusType.Terminated) {
      return (
        <div className={styles.status}>
          <Cell icon="dangqianjiedian" title={flowIns.currentNodeName} desc="当前节点" />
          <Cell
            getContainer={getContainer}
            icon="dangqianchuliren"
            title={flowIns.currentProcessor.users.map((user) => user.name).join(',')}
            desc="当前处理人"
          />

          {trackCell}
        </div>
      );
    }

    return (
      <div className={styles.status}>
        <Cell icon="dangqianchuliren" title={flowIns.applyUser.name} desc="申请人" getContainer={getContainer} />
        <Cell icon="xuanzeshijian" title={moment(flowIns.applyTime).format('YYYY-MM-DD HH:mm:ss')} desc="申请时间" />

        {trackCell}
      </div>
    );
  }, [flowIns, showCurrentProcessor, getContainer]);

  return (
    <div className={classnames(styles.statusbar, styleName, className)} ref={containerRef}>
      <div className={styles.content}>
        <img className={styles.image} src={image} alt="状态图" />
        {content}
      </div>
    </div>
  );
}

export default memo(StatusBar);
