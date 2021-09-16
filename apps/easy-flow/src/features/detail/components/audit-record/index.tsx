import { memo, useMemo } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Icon, Avatar } from '@common/components';
import { AuditRecordType, AuditRecordSchema } from '@type/detail';
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
  className?: string;
}

function NodeActionRecord(props: NodeActionRecordProps) {
  const { data, className } = props;
  const icon = useMemo(() => {
    const isProcessing = data.auditRecordList.find((record) => record.auditType === AuditRecordType.RUNNING);

    if (isProcessing) {
      return {
        type: 'shenhejilujinxingzhong',
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
    <div className={classnames(styles.container, className)}>
      <div className={classnames(styles.icon, icon.className)}>
        <Icon type={icon.type} />
      </div>
      <div className={styles.content}>
        <div className={styles['node-name']}>{data.taskName}</div>

        {data.auditRecordList.map((record) => {
          return (
            <div className={styles.node} key={record.taskId}>
              {formatRecordList(record).map((member) => {
                const action = mapActionInfo(record.auditType);

                return (
                  <div className={styles.user} key={member.id}>
                    <Avatar size={24} className={styles.avatar} src={member.avatar} name={member.name} />
                    <div className={styles['user-name']}>{member.name}</div>
                    <div className={classnames(styles.tag, action.className)}>{action.text}</div>
                  </div>
                );
              })}

              {record.auditTime && (
                <div className={styles.time}>{moment(record.auditTime).format('YYYY.MM.DD HH:mm:ss')}</div>
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

function formatRecordList(data: AuditRecordSchema['auditRecordList'][number]) {
  const users = data.userList || [];
  const depts = data.deptList || [];
  const roles = data.roleList || [];

  return depts
    .concat(roles)
    .concat(users)
    .map((item) => ({ name: item.name, avatar: item.avatar, id: item.id }));
}
