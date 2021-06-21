import { memo, useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router';
import { message, FormInstance } from 'antd';
import { Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import ConfirmModal from './components/confirm-modal';
import Header from '@components/header';
import { runtimeAxios } from '@utils';
import { loadFlowData } from '@/apis/detail';
import { dynamicRoutes } from '@consts';
import Detail from './components/detail';
import Empty from './components/empty';
import FlowNodeActions from './components/flow-node-actions';
import { FormMeta, FormValue, FlowMeta, FlowInstance, TaskDetailType } from '@type/detail';
import styles from './index.module.scss';

export type DataType = {
  task: {
    id: string;
    state: TaskDetailType;
  };
  flow: {
    node: FlowMeta;
    instance: FlowInstance;
  };
  form: {
    meta: FormMeta;
    value: FormValue;
  };
};

const loadData = async function (taskId: string): Promise<DataType> {
  const { data } = await runtimeAxios.get(`/process_instance/getInstanceDetailByTaskId?taskId=${taskId}`);
  const flowInstance: DataType['flow']['instance'] = data.processInstance;
  const [formMeta, formValue, node] = await loadFlowData(flowInstance, data.state);

  return {
    task: {
      id: data.id,
      state: data.state,
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
  const history = useHistory();
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState(false);
  const [showConfirmType, setShowConfirmType] = useState<AudiitConfirmType>(AudiitConfirmType.Cancel);
  const formRef = useRef<FormInstance<FormValue>>(null);

  useEffect(() => {
    setLoading(true);

    loadData(taskId)
      .then((data) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [taskId]);

  const handleSaveNodeForm = useMemoCallback(async () => {
    if (!formRef.current) return;

    await runtimeAxios.post(`/process_instance/saveNodeForm`, {
      formData: formRef.current.getFieldsValue(),
      taskId,
    });

    message.success('保存成功');
  });

  const handleSubmitNodeForm = useMemoCallback(async () => {
    if (!formRef.current || !data) return;
    const formValues = await formRef.current.validateFields();

    await runtimeAxios.post(`/process_instance/submit`, {
      formData: formValues,
      taskId,
    });

    message.success('提交成功');

    setTimeout(() => {
      history.replace(dynamicRoutes.toTaskCenter(data.flow.instance.subapp.app.id));
    }, 1500);
  });

  const handleConfirm = useMemoCallback(async (remark: string) => {
    if (!formRef.current || !data) return;

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
      history.replace(dynamicRoutes.toTaskCenter(data.flow.instance.subapp.app.id));
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
        {data && (
          <FlowNodeActions
            flowMeta={data.flow.node}
            operable={data.task.state === TaskDetailType.MyTodo}
            onSave={handleSaveNodeForm}
            onSubmit={handleSubmitNodeForm}
            onApprove={handleApprove}
            onRevert={handleRevert}
          />
        )}
      </Header>

      {(data && (
        <Detail className={styles.main} flow={data.flow} form={data.form} type={data.task.state} ref={formRef} />
      )) || <Empty className={styles.empty} text="暂无数据" />}

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
