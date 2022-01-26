import { memo, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { message } from "antd";
import { Loading, AsyncButton } from "@common/components";
import Header from "@components/header";
import { runtimeAxios } from "@utils";
import { dynamicRoutes } from "@consts";
import { loadFlowData } from "@apis/detail";
import Detail from "./components/detail";
import Empty from "./components/empty";
import { FormValue, FormMeta, FlowMeta, TaskDetailType, FlowInstance } from "@type/detail";
import useMemoCallback from "@common/hooks/use-memo-callback";
import ConfirmModal, { ActionType } from "./components/confirm-modal";
import styles from "./index.module.scss";

type DataType = {
  form: {
    meta: FormMeta;
    value: FormValue;
  };
  flow: {
    node: FlowMeta;
    instance: FlowInstance;
  };
};

const loadData = async function (flowId: string): Promise<DataType> {
  const { data } = await runtimeAxios.get<{ data: FlowInstance }>(`/process_instance/${flowId}`);
  const [formMeta, formValue, node] = await loadFlowData(data, TaskDetailType.MyInitiation);

  return {
    flow: {
      instance: data,
      node,
    },
    form: {
      meta: formMeta,
      value: formValue,
    },
  };
};

function StartDetail() {
  const { flowId } = useParams<{ flowId: string }>();
  const [data, setData] = useState<DataType>();
  const [canRevoke, setCanRevoke] = useState(false);
  const [showConfirm, setShowConfirm] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        await Promise.all([
          loadData(flowId).then((data) => {
            setData(data);
          }),
          runtimeAxios
            .get(`/process_instance/isRevocable?processInstanceId=${flowId}`, { silence: true })
            .then((resp) => {
              setCanRevoke(resp.data);
            }),
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [flowId]);

  const handleRevokeTask = useMemoCallback(async (remark: string) => {
    await runtimeAxios.post("/process_instance/revoke", {
      processInstanceId: flowId,
      remark,
    });

    setShowConfirm(false);
    message.success("撤回成功");

    setTimeout(() => {
      history.replace(`${dynamicRoutes.toTaskCenter(data!.flow.instance.subapp.app.id)}`);
    }, 1500);
  });

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      <Header className={styles.header} backText="流程详情" backClassName={styles.back}>
        <AsyncButton size="large" disabled={!canRevoke} onClick={() => setShowConfirm(true)}>
          撤回
        </AsyncButton>
      </Header>

      {(data && (
        <Detail className={styles.main} flow={data.flow} form={data.form} type={TaskDetailType.MyInitiation} />
      )) || <Empty className={styles.empty} text="暂无数据" />}

      {showConfirm !== undefined && (
        <ConfirmModal
          visble={Boolean(showConfirm)}
          type={ActionType.Revoke}
          onCanel={() => {
            setShowConfirm(false);
          }}
          onConfirm={handleRevokeTask}
        />
      )}
    </div>
  );
}

export default memo(StartDetail);
