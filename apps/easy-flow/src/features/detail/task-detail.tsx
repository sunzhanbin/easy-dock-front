import { memo, useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router";
import { message, FormInstance } from "antd";
import { Loading } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import ConfirmModal, { ActionType } from "./components/confirm-modal";
import Header from "@components/header";
import { runtimeAxios, uploadFile, validateTabs } from "@utils";
import { loadFlowData } from "@/apis/detail";
import { dynamicRoutes } from "@consts";
import Detail from "./components/detail";
import Empty from "./components/empty";
import FlowNodeActions from "./components/flow-node-actions";
import { FormMeta, FormValue, FlowMeta, FlowInstance, TaskDetailType } from "@type/detail";
import styles from "./index.module.scss";
import { useAppSelector } from "@/app/hooks";
import { modeSelector } from "../task-center/taskcenter-slice";
import classnames from "classnames";

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
  const { data } = await runtimeAxios.get<{
    data: { processInstance: DataType["flow"]["instance"]; id: string; state: TaskDetailType };
  }>(`/process_instance/getInstanceDetailByTaskId?taskId=${taskId}`);
  const flowInstance = data.processInstance;
  const [formMeta, formValue, node] = await loadFlowData(flowInstance);

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

function FlowDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const history = useHistory();
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [showConfirmType, setShowConfirmType] = useState<ActionType>();
  const formRef = useRef<FormInstance<FormValue>>(null);
  const appId = data?.flow.instance.subapp.app.id;
  const mode = useAppSelector(modeSelector);

  useEffect(() => {
    setLoading(true);

    loadData(taskId)
      .then((data) => {
        setData(data);
      })
      .finally(() => {
        !isUnmounted && setLoading(false);
      });
    return () => {
      setIsUnmounted(true);
    };
  }, [taskId, isUnmounted]);

  const handleSaveNodeForm = useMemoCallback(async () => {
    if (!formRef.current) return;
    validateTabs(formRef.current);
    const values = await formRef.current.validateFields();
    const formValues = await uploadFile(values);

    await runtimeAxios.post("/process_instance/saveNodeForm", {
      formData: formValues,
      taskId,
    });

    message.success("保存成功");
  });

  const handleSubmitNodeForm = useMemoCallback(async () => {
    validateTabs(formRef.current!);
    const values = await formRef.current!.validateFields();
    const formValues = await uploadFile(values);

    await runtimeAxios.post("/process_instance/submit", {
      formData: formValues,
      taskId,
    });
    message.success("提交成功");
    setTimeout(() => {
      history.replace(dynamicRoutes.toTaskCenter(appId!));
    }, 1500);
  });

  const handleConfirm = useMemoCallback(async (remark: string) => {
    validateTabs(formRef.current!);
    const values = await formRef.current!.validateFields();
    const formValues = await uploadFile(values);

    // 同意
    if (showConfirmType === ActionType.Approve) {
      await runtimeAxios.post("/process_instance/approve", {
        formData: formValues,
        remark,
        taskId,
      });
      // 终止
    } else if (showConfirmType === ActionType.Terminate) {
      await runtimeAxios.post("/process_instance/stop", {
        formData: formValues,
        taskId,
        remark,
      });
    } else if (showConfirmType === ActionType.Revert) {
      // 驳回
      await runtimeAxios.post("/process_instance/backTo", {
        formData: formValues,
        remark,
        taskId,
      });
    }

    message.success("操作成功");
    setShowConfirmType(ActionType.Cancel);

    setTimeout(() => {
      history.replace(dynamicRoutes.toTaskCenter(appId!));
    }, 1500);
  });

  const handleApprove = useMemoCallback(async () => {
    await formRef.current!.validateFields();

    setShowConfirmType(ActionType.Approve);
  });

  const handleRevert = useMemoCallback(async () => {
    await formRef.current!.validateFields();

    setShowConfirmType(ActionType.Revert);
  });

  const handleTerminate = useMemoCallback(async () => {
    await formRef.current!.validateFields();

    setShowConfirmType(ActionType.Terminate);
  });

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      <Header className={classnames(styles.header, styles.mainHeader)} backClassName={styles.back} backText="流程详情">
        {mode === "running" && data && (
          <FlowNodeActions
            flowMeta={data.flow.node}
            operable={data.task.state === TaskDetailType.MyTodo}
            onSave={handleSaveNodeForm}
            onSubmit={handleSubmitNodeForm}
            onApprove={handleApprove}
            onRevert={handleRevert}
            onTerminate={handleTerminate}
          />
        )}
      </Header>

      {(data && (
        <Detail className={styles.main} flow={data.flow} form={data.form} type={data.task.state} ref={formRef} />
      )) || <Empty className={styles.empty} text="暂无数据" />}

      {showConfirmType !== undefined && (
        <ConfirmModal
          visble={showConfirmType !== ActionType.Cancel}
          type={showConfirmType}
          onCanel={() => {
            setShowConfirmType(ActionType.Cancel);
          }}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default memo(FlowDetail);
