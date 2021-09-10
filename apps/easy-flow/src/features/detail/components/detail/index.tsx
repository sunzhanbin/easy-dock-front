import { forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { FormInstance } from 'antd';
import classnames from 'classnames';
import { runtimeAxios } from '@utils';
import { loadDatasource } from '@apis/detail';
import FormEngine from '@components/form-engine';
import FlowStatusBar from '../flow-statusbar';
import AuditRecord from '../audit-record';
import {
  FlowMeta,
  FlowInstance,
  FormMeta,
  FormValue,
  AuditRecordSchema,
  TaskDetailType,
  Datasource,
} from '@type/detail';
import styles from './index.module.scss';

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

const Detail = forwardRef(function Detail(props: DetailProps, ref: React.ForwardedRef<FormInstance<FormValue>>) {
  const { flow, form, type, className } = props;
  const [auditRecords, setAuditRecords] = useState<AuditRecordSchema[]>([]);
  const [datasource, setDatasource] = useState<Datasource>();
  const [projectId, setProjectId] = useState();

  const appId = useMemo<number>(() => {
    return flow.instance.subapp.app.id;
  }, [flow]);

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

    loadDatasource(form.meta, flow.node.fieldsAuths, flow.instance.subapp.version.id).then((values) => {
      setDatasource(values);
    });
  }, [flow, form]);

  useEffect(() => {
    if (!appId) {
      return;
    }
    runtimeAxios.get(`/app/${appId}`).then((res) => {
      const projectId = res.data?.project?.id;
      setProjectId(projectId);
    });
  }, [appId]);

  return (
    <div className={classnames(styles.main, className)}>
      <div className={styles.content}>
        <FlowStatusBar flowIns={flow.instance} showCurrentProcessor={type === TaskDetailType.MyInitiation} />
        <div className={styles.form}>
          <div className={styles.title}>{flow.instance.subapp.name}</div>
          {datasource && projectId && (
            <FormEngine
              datasource={datasource}
              readonly={type !== TaskDetailType.MyTodo}
              ref={ref}
              data={form.meta}
              projectId={projectId}
              initialValue={form.value}
              fieldsAuths={flow.node.fieldsAuths}
            />
          )}
        </div>
      </div>
      <div className={styles.flow}>
        <div className={styles['record-title']}>审核记录</div>
        <div className={styles.detail}>
          {auditRecords.map((record, index) => (
            <AuditRecord
              className={auditRecords.length === index + 1 ? styles['last-record'] : ''}
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
