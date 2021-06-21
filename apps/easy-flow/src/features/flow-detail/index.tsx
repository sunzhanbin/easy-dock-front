import { memo, useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { message, FormInstance } from 'antd';
import { Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import FormEngine from '@components/form-engine';
import ConfirmModal from './components/confirm-modal';
import Header from '@components/header';
import { runtimeAxios } from '@utils';
import StatusBar from './components/statusbar';
import AuditRecord from './components/audit-record';
import ActionButtons from './components/action-buttons';
import { FormValue } from '@type/flow';
import { AuditRecordSchema, DetailData, TaskDetailType } from './type';
import emptyImage from '@assets/empty.png';
import styles from './index.module.scss';

const loadData = async function (taskId: string): Promise<DetailData> {
  const { data: detail } = await runtimeAxios.get(`/process_instance/getInstanceDetailByTaskId?taskId=${taskId}`);
  const subApp = detail.processInstance.subapp;
  const flowInstance: DetailData['flow']['instance'] = detail.processInstance;
  const [formMeta, formValue, node] = await Promise.all([
    // 表单元数据
    runtimeAxios.get(`/form/version/${subApp.version.id}`).then(({ data }) => {
      return data.meta;
    }),
    // 用户填写的表单数据
    runtimeAxios
      .post('/task/getFormData', {
        processInstanceId: flowInstance.processInstanceId,
        type: detail.state,
        key: flowInstance.currentNodeId,
      })
      .then(({ data }) => JSON.parse(data)),
    // 流程节点元数据
    runtimeAxios
      .post<{ data: string }>(`/process_instance/getProcessNodeMeta`, {
        processInstanceId: flowInstance.processInstanceId,
        type: detail.state,
        key: flowInstance.currentNodeId,
      })
      .then(({ data }) => {
        return JSON.parse(data);
      }),
  ]);

  detail.processInstance.subApp = detail.processInstance.subapp;

  delete detail.processInstance.subapp;

  return {
    task: {
      id: detail.id,
      state: detail.state,
    },
    flow: {
      instance: flowInstance,
      node,
    },
    form: {
      meta: formMeta,
      value: formValue,
    },
  };
};

enum AudiitConfirmType {
  Approve = 1,
  Revert = 2,
  Cancel = 0,
}

function FlowDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const [detailData, setDetailData] = useState<DetailData>();
  const [loading, setLoading] = useState(false);
  const [auditRecords, setAuditRecords] = useState<AuditRecordSchema[]>([]);
  const [showConfirmType, setShowConfirmType] = useState<AudiitConfirmType>(AudiitConfirmType.Cancel);
  const formRef = useRef<FormInstance<FormValue>>(null);

  useEffect(() => {
    setLoading(true);

    loadData(taskId)
      .then((data) => {
        setDetailData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [taskId]);

  useEffect(() => {
    if (!detailData) return;

    runtimeAxios
      .get<{ data: AuditRecordSchema[] }>(
        `/process_instance/getAuditRecordsList?processInstanceId=${detailData.flow.instance.processInstanceId}`,
      )
      .then(({ data }) => {
        setAuditRecords(data);
      });
  }, [detailData]);

  const formVnode = useMemo(() => {
    if (!detailData) return null;

    const { flow, form } = detailData;
    const isCanFill = TaskDetailType.MyTodo === detailData.task.state;

    return (
      <FormEngine
        readonly={!isCanFill}
        ref={formRef}
        data={form.meta}
        initialValue={form.value}
        fieldsAuths={flow.node.fieldsAuths}
      />
    );
  }, [detailData]);

  const handleSaveNodeForm = useMemoCallback(async () => {
    if (!formRef.current) return;

    await runtimeAxios.post(`/process_instance/saveNodeForm`, {
      formData: formRef.current.getFieldsValue(),
      taskId,
    });

    message.success('保存成功');
  });

  const handleSubmitNodeForm = useMemoCallback(async () => {
    if (!formRef.current) return;

    const formValues = await formRef.current.validateFields();

    await runtimeAxios.post(`/process_instance/submit`, {
      formData: formValues,
      taskId,
    });

    message.success('提交成功');

    setTimeout(() => {}, 1500);
  });

  const handleConfirm = useMemoCallback(async (remark: string) => {
    if (!formRef.current || !detailData) return;

    const values = await formRef.current.validateFields();

    // 同意
    if (showConfirmType === AudiitConfirmType.Approve) {
      await runtimeAxios.post(`/process_instance/approve`, {
        formData: values,
        remark,
        taskId,
      });
    } else {
      // 驳回
      await runtimeAxios.post(`/process_instance/backTo`, {
        formData: values,
        remark,
        taskId,
      });
    }

    message.success('操作成功');
    setShowConfirmType(AudiitConfirmType.Cancel);

    setTimeout(() => {
      // 回任务中心
    }, 1500);
  });

  const handleApprove = useMemoCallback(() => {
    setShowConfirmType(AudiitConfirmType.Approve);
  });

  const handleRevert = useMemoCallback(() => {
    setShowConfirmType(AudiitConfirmType.Revert);
  });

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      <Header className={styles.header} backText="流程详情">
        {detailData && (
          <ActionButtons
            data={detailData}
            onSave={handleSaveNodeForm}
            onSubmit={handleSubmitNodeForm}
            onApprove={handleApprove}
            onRevert={handleRevert}
          />
        )}
      </Header>

      {(detailData && (
        <div className={styles.main}>
          <div className={styles.content}>
            <StatusBar data={detailData} />
            <div className={styles.form}>
              <div className={styles.title}>{detailData.flow.instance.subApp.name}</div>
              <>{formVnode}</>
            </div>
          </div>
          <div className={styles.flow}>
            <div className={styles.detail}>
              {auditRecords.map((record, index) => (
                <AuditRecord data={record} key={index}></AuditRecord>
              ))}
            </div>
          </div>
        </div>
      )) || (
        <div className={styles.empty}>
          <img src={emptyImage} alt="无数据" />
          <div>暂无数据</div>
        </div>
      )}

      {showConfirmType !== undefined && (
        <ConfirmModal
          visble={showConfirmType !== AudiitConfirmType.Cancel}
          isApprove={showConfirmType === AudiitConfirmType.Approve}
          onCanel={() => {
            setShowConfirmType(AudiitConfirmType.Cancel);
          }}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default memo(FlowDetail);
