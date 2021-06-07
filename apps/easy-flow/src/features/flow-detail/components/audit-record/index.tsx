import { memo, useMemo } from 'react';
import classnames from 'classnames';
import { Icon } from '@common/components';
import { AuditRecordType } from '@type/flow';
import { FlowDetaiDataType } from '../../type';
import styles from './index.module.scss';

interface IconBoxProps {
  type: 'success' | 'fial' | 'end';
}

function IconBox(props: IconBoxProps) {
  const { type } = props;

  return (
    <div className={styles.icon}>
      <Icon type="gou"></Icon>
    </div>
  );
}

interface AuditRecordProps {
  data: FlowDetaiDataType['auditRecords'][number];
}

function AuditRecord(props: AuditRecordProps) {
  const { data } = props;
  const icon = useMemo(() => {
    const { auditType } = data;

    if (
      auditType === AuditRecordType.APPROVE ||
      auditType === AuditRecordType.FORM_FILL ||
      auditType === AuditRecordType.TURN
    ) {
      return {
        type: 'gou',
        className: styles.success,
      };
    }

    if (auditType === AuditRecordType.REJECT || auditType === AuditRecordType.INSTANCE_STOP) {
      return {
        type: 'guanbi',
        className: styles.error,
      };
    }

    return {
      type: '',
      className: styles.processing,
    };
  }, [data.auditType]);

  const tag = useMemo(() => {
    const { auditType } = data;

    if (auditType === AuditRecordType.APPROVE) {
      return {
        text: '同意',
        className: styles.success,
      };
    }

    if (auditType === AuditRecordType.FORM_FILL) {
      return {
        text: '提交',
        className: styles.primary,
      };
    }

    if (auditType === AuditRecordType.REJECT) {
      return {
        text: '驳回',
        className: styles.warning,
      };
    }

    if (auditType === AuditRecordType.INSTANCE_STOP) {
      return {
        text: '终止',
        className: styles.error,
      };
    }

    if (auditType === AuditRecordType.TURN) {
      return {
        text: '转办',
        className: styles.primary,
      };
    }

    if (auditType === AuditRecordType.START) {
      return {
        text: '开始',
        className: styles.primary,
      };
    }

    return null as never;
  }, [data.auditType]);

  return (
    <div className={styles.container}>
      <div className={classnames(styles.icon, icon.className)}>
        <Icon type={icon.type} />
      </div>
      <div className={styles.content}>
        <div className={styles['node-name']}>{data.nodeName}</div>
        <div className={styles.user}>
          <img className={styles.avatar} src={data.userAvatar} alt="用户头像" />
          <div className={styles['user-name']}>{data.userName}</div>
          <div className={classnames(styles.tag, tag.className)}>{tag.text}</div>
        </div>

        <div className={styles.time}>{data.auditTime}</div>

        {data.comments && (
          <div className={styles.comment}>
            <Icon type="xiangqing" />
            <div className={styles.text}>{data.comments}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(AuditRecord);
