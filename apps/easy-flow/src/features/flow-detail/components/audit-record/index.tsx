import { memo, useMemo } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Icon, Avatar } from '@common/components';
import { AuditRecordType } from '@type/flow';
import { AuditRecordSchema } from '../../type';
import styles from './index.module.scss';

function mapActionInfo(type: AuditRecordType) {
  if (type === AuditRecordType.APPROVE) {
    return {
      text: '同意',
      className: styles.success,
    };
  }

  if (type === AuditRecordType.FORM_FILL) {
    return {
      text: '提交',
      className: styles.primary,
    };
  }

  if (type === AuditRecordType.REJECT) {
    return {
      text: '驳回',
      className: styles.warning,
    };
  }

  if (type === AuditRecordType.INSTANCE_STOP) {
    return {
      text: '终止',
      className: styles.error,
    };
  }

  if (type === AuditRecordType.TURN) {
    return {
      text: '转办',
      className: styles.primary,
    };
  }

  if (type === AuditRecordType.START) {
    return {
      text: '开始',
      className: styles.primary,
    };
  }

  if (type === AuditRecordType.BACK) {
    return {
      text: '撤回',
      className: styles.success,
    };
  }

  if (type === AuditRecordType.RUNNING) {
    return {
      text: '进行中',
      className: styles.primary,
    };
  }

  return null as never;
}

interface NodeActionRecordProps {
  data: AuditRecordSchema;
}

function NodeActionRecord(props: NodeActionRecordProps) {
  const { data } = props;
  const icon = useMemo(() => {
    const isProcessing = data.auditRecordList.find((record) => record.auditType === AuditRecordType.RUNNING);

    if (isProcessing) {
      return {
        type: 'shezhi',
        className: styles.processing,
      };
    }

    const isRejected = data.auditRecordList.find((record) => {
      return record.auditType === AuditRecordType.REJECT || record.auditType === AuditRecordType.INSTANCE_STOP;
    });

    if (isRejected) {
      return {
        type: 'guanbi',
        className: styles.error,
      };
    }

    return {
      type: 'gou',
      className: styles.success,
    };
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={classnames(styles.icon, icon.className)}>
        <Icon type={icon.type} />
      </div>
      <div className={styles.content}>
        <div className={styles['node-name']}>{data.taskName}</div>

        {data.auditRecordList.map((record) => {
          return (
            <div key={record.taskId}>
              {record.userList.map((user) => {
                const action = mapActionInfo(record.auditType);

                return (
                  <div className={styles.user} key={user.id}>
                    <Avatar size={24} className={styles.avatar} src={user.avatar} name={user.name} />
                    <div className={styles['user-name']}>{user.name}</div>
                    <div className={classnames(styles.tag, action.className)}>{action.text}</div>
                  </div>
                );
              })}

              {record.auditTime && (
                <div className={styles.time}>{moment(record.auditTime).format('YY.MM.DD HH:mm:ss')}</div>
              )}

              {record.comments?.commit && (
                <div className={styles.comment}>
                  <Icon type="xiangqing" />
                  <div className={styles.text}>{record.comments.commit}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(NodeActionRecord);
