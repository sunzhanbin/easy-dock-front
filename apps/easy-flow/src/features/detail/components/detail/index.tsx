import { forwardRef, memo, useEffect, useState, useMemo } from "react";
import { FormInstance } from "antd";
import classnames from "classnames";
import { runtimeAxios } from "@utils";
import { loadDatasource } from "@apis/detail";
import FormEngine from "@components/form-engine";
import FlowStatusBar from "../flow-statusbar";
import AuditRecord from "../audit-record";
import {
  FlowMeta,
  FlowInstance,
  FormMeta,
  FormValue,
  AuditRecordSchema,
  TaskDetailType,
  Datasource,
} from "@type/detail";
import styles from "./index.module.scss";
import moment from "moment";

interface DetailProps {
  className?: string;
  flow: {
    node: FlowMeta;
    instance: FlowInstance;
  };
  form: {
    meta: FormMeta;
    value: FormValue;
  };
  type?: TaskDetailType;
}

// const dateReg = /^\d{4}(-|\/|)$/

const Detail = forwardRef(function Detail(props: DetailProps, ref: React.ForwardedRef<FormInstance<FormValue>>) {
  const { flow, form, type, className } = props;
  const [auditRecords, setAuditRecords] = useState<AuditRecordSchema[]>([]);
  const [datasource, setDatasource] = useState<Datasource>();

  useEffect(() => {
    if (!flow) return;

    runtimeAxios
      .get<{ data: AuditRecordSchema[] }>(
        `/process_instance/getAuditRecordsList?processInstanceId=${flow.instance.processInstanceId}`,
      )
      .then(({ data }) => {
        setAuditRecords(data);
      });
  }, [flow]);

  useEffect(() => {
    if (!flow || !form) return;
    loadDatasource(
      form.meta,
      flow.node.fieldsAuths,
      flow.instance.subapp.version.id,
      flow.instance.processInstanceId,
    ).then((values) => {
      setDatasource(values);
    });
  }, [flow, form]);
  const initialValue = useMemo(() => {
    const dateFields = form.meta.components.filter((item) => item.config.type === "Date").map((item) => item.props.id);
    const valueMap = { ...form.value };
    Object.values(dateFields).map((field) => {
      // form.value有可能为null或undefined
      if (form.value && !Object.keys(form.value).includes(field)) {
        valueMap[field] = moment().valueOf();
      }
      if (typeof valueMap[field] === "string") {
        if (Number(valueMap[field])) {
          valueMap[field] = Number(valueMap[field]);
        } else {
          const time = valueMap[field].replace(/年|月/g, "-").replace(/时|分/g, ":").replace(/日|秒/g, "");
          valueMap[field] = moment(time).valueOf();
        }
      }
      return field;
    });
    return valueMap;
  }, [form.value, form.meta]);
  return (
    <div className={classnames(styles.main, className)}>
      <div className={styles.content}>
        <FlowStatusBar flowIns={flow.instance} showCurrentProcessor={type === TaskDetailType.MyInitiation} />
        <div className={styles.form}>
          <div className={styles.title}>{flow.instance.subapp.name}</div>
          {datasource && (
            <FormEngine
              datasource={datasource}
              readonly={type !== TaskDetailType.MyTodo}
              ref={ref}
              data={form.meta}
              projectId={flow.instance.subapp.app.project.id}
              initialValue={initialValue}
              fieldsAuths={flow.node.fieldsAuths}
              nodeType="detail"
            />
          )}
        </div>
      </div>
      <div className={styles.flow}>
        <div className={styles["record-title"]}>审核记录</div>
        <div className={styles.detail}>
          {auditRecords.map((record, index) => (
            <AuditRecord
              className={auditRecords.length === index + 1 ? styles["last-record"] : ""}
              data={record}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default memo(Detail);
