import { ReactNode, memo, useMemo } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import appConfig from '@/init';
import { timeDiff } from '@utils';
import { Icon } from '@common/components';
import { NodeStatusType } from '@type/flow';
import { DetailData, TaskDetailType } from '../../type';
import styles from './index.module.scss';

interface CellProps {
  title: string | ReactNode;
  icon?: string;
  desc: string | ReactNode;
}

const Cell = memo(function Cell(props: CellProps) {
  const { title, icon, desc } = props;
  return (
    <div className={styles.cell}>
      {icon && <Icon className={styles['cell-icon']} type={icon} />}
      <div className={styles['cell-content']}>
        <div className={styles['cell-title']}>{title}</div>
        <div className={styles['cell-desc']}>{desc}</div>
      </div>
    </div>
  );
});

interface StatusBarProps {
  data: DetailData;
  className?: string;
}

function StatusBar(props: StatusBarProps) {
  const { data, className } = props;
  const status = data.flow.instance.state;
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

  // 渲染statusbar内容
  const content = useMemo(() => {
    const flowDetail = data.flow.instance;
    const trackNode = (
      <div className={styles.track}>
        <span>流程跟踪</span>
        <Icon type="jinru" />
      </div>
    );

    // 办结状态显示
    if (data.flow.instance.state === NodeStatusType.Finish) {
      return (
        <div className={classnames(styles.status, styles.finish)}>
          <Cell title={timeDiff(flowDetail.endTime - flowDetail.applyTime)} desc="流程耗时" />

          <div>{trackNode}</div>
        </div>
      );
    }

    const trackCell = (
      <Cell
        title={<div className={styles['time-used']}>{`流程用时 ${timeDiff(Date.now() - flowDetail.applyTime)}`}</div>}
        desc={trackNode}
      />
    );

    // 我的发起
    if (TaskDetailType.MyInitiation === data.task.state) {
      return (
        <div className={styles.status}>
          <Cell icon="dangqianjiedian" title={data.flow.node.name} desc="当前节点" />
          <Cell
            icon="dangqianchuliren"
            title={flowDetail.currentProcessor.users.map((user) => user.name).join(',')}
            desc="当前处理人"
          />

          {trackCell}
        </div>
      );
    }

    return (
      <div className={styles.status}>
        <Cell icon="dangqianchuliren" title={flowDetail.applyUser.name} desc="申请人" />
        <Cell icon="xuanzeshijian" title={moment(flowDetail.applyTime).format('YYYY-MM-DD HH:mm:ss')} desc="申请时间" />

        {trackCell}
      </div>
    );
  }, [data]);

  return (
    <div className={classnames(styles.statusbar, styleName, className)}>
      <div className={styles.content}>
        <img className={styles.image} src={image} alt="状态图" />
        {content}
      </div>
    </div>
  );
}

export default memo(StatusBar);
