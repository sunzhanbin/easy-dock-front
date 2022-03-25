import { memo, ReactNode, useMemo } from "react";
import classnames from "classnames";
import moment from "moment";
import { Icon, Avatar } from "@common/components";
import Tag, { StatusTagProps } from "@components/status-tag";
import { AuditRecordType, AuditRecordSchema, Comments } from "@type/detail";
import styles from "./index.module.scss";

function mapActionInfo(type: AuditRecordType): { text: string; status: StatusTagProps["status"] } {
  if (type === AuditRecordType.APPROVE) {
    return {
      text: "同意",
      status: "success",
    };
  }

  if (type === AuditRecordType.FORM_FILL) {
    return {
      text: "提交",
      status: "primary",
    };
  }

  if (type === AuditRecordType.REJECT) {
    return {
      text: "驳回",
      status: "warning",
    };
  }

  if (type === AuditRecordType.INSTANCE_STOP) {
    return {
      text: "终止",
      status: "error",
    };
  }

  if (type === AuditRecordType.TURN) {
    return {
      text: "转办",
      status: "primary",
    };
  }

  if (type === AuditRecordType.START) {
    return {
      text: "开始",
      status: "primary",
    };
  }

  if (type === AuditRecordType.BACK) {
    return {
      text: "撤回",
      status: "revoke",
    };
  }

  if (type === AuditRecordType.RUNNING) {
    return {
      text: "进行中",
      status: "primary",
    };
  }

  if (type === AuditRecordType.AUTO_PROCESS_TRIGGER) {
    return {
      text: "流程触发",
      status: "primary",
    };
  }

  if (type === AuditRecordType.AUTO_INTERFACE_PUSH) {
    return {
      text: "数据连接",
      status: "primary",
    };
  }
  if (type === AuditRecordType.AUTO_PLUGIN) {
    return {
      text: "插件节点",
      status: "primary",
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
        type: "shenhejilujinxingzhong",
        className: styles.processing,
      };
    }

    const isRejected = data.auditRecordList.find((record) => {
      return record.auditType === AuditRecordType.REJECT || record.auditType === AuditRecordType.INSTANCE_STOP;
    });

    if (isRejected) {
      return {
        type: "guanbi",
        className: styles.error,
      };
    }

    return {
      type: "gou",
      className: styles.success,
    };
  }, [data]);

  const renderActionResult = (auditType: AuditRecordType, comments: Comments | undefined): ReactNode => {
    if (!comments) {
      return null;
    }
    if (comments.autoPushDataResult) {
      const name = comments.actionName;
      const result = comments.autoPushDataResult?.resultCode ?? -1;
      // const reason = comments.autoPushDataResult?.detailMessage;
      return (
        <>
          <div className={styles["action-result"]}>
            <div className={styles["action-name"]}>{name}</div>
            <div className={classnames(styles.result, result === 0 ? styles.success : styles.failed)}>
              {result === 0 ? "成功" : "失败"}
            </div>
          </div>
          {/* {result !== 0 && (
            <div className={styles["action-result"]}>
              <div className={styles["action-name"]}>
                <span className={styles.name}>{reason}</span>
              </div>
            </div>
          )} */}
        </>
      );
    }
    if (comments.autoTriggerResults) {
      const resultList = comments.autoTriggerResults || [];
      return resultList.map(({ processInfo, resultCode }, index) => {
        return (
          <div className={styles["action-result"]} key={index}>
            <div className={styles["action-name"]}>
              <span>触发流程</span>
              <span className={styles.name}>{processInfo.name}</span>
            </div>
            <div className={classnames(styles.result, resultCode === 0 ? styles.success : styles.failed)}>
              {resultCode === 0 ? "成功" : "失败"}
            </div>
          </div>
        );
      });
    }
    return null;
  };

  return (
    <div className={classnames(styles.container, className)}>
      <div className={classnames(styles.icon, icon.className)}>
        <Icon type={icon.type} />
      </div>
      <div className={styles.content}>
        <div className={styles["node-name"]}>{data.taskName}</div>

        {data.auditRecordList.map((record) => {
          return (
            <div className={styles.node} key={record.taskId}>
              {formatRecordList(record).map((member) => {
                const action = mapActionInfo(record.auditType);

                return (
                  <div className={styles.user} key={member.id}>
                    <Avatar size={24} className={styles.avatar} src={member.avatar} name={member.name} />
                    <div className={styles["user-name"]}>{member.name}</div>
                    <Tag status={action.status}>{action.text}</Tag>
                  </div>
                );
              })}

              {record.auditTime && (
                <div className={styles.time}>{moment(record.auditTime).format("YYYY.MM.DD HH:mm:ss")}</div>
              )}

              {record.comments?.commit && (
                <div className={styles.comment}>
                  <Icon type="xiangqing" />
                  <div className={styles.text}>{record.comments.commit}</div>
                </div>
              )}

              {renderActionResult(record.auditType, record.comments)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(NodeActionRecord);

function formatRecordList(data: AuditRecordSchema["auditRecordList"][number]) {
  const users = data.userList || [];
  const depts = data.deptList || [];
  const roles = data.roleList || [];

  return depts
    .concat(roles)
    .concat(users)
    .map((item) => ({ name: item.name, avatar: item.avatar, id: item.id }));
}
