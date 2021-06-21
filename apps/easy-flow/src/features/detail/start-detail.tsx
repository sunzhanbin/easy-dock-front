import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Loading, AsyncButton } from '@common/components';
import Header from '@components/header';
import { runtimeAxios } from '@utils';
import { loadFlowData } from '@apis/detail';
import Detail from './components/detail';
import Empty from './components/empty';
import { FormValue, FormMeta, FlowMeta, TaskDetailType, FlowInstance } from '@type/detail';
import styles from './index.module.scss';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    loadData(flowId)
      .then((data) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [flowId]);

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      <Header className={styles.header} backText="流程详情">
        <AsyncButton size="large" disabled>
          撤回
        </AsyncButton>
      </Header>

      {(data && (
        <Detail className={styles.main} flow={data.flow} form={data.form} type={TaskDetailType.MyInitiation} />
      )) || <Empty className={styles.empty} text="暂无数据" />}
    </div>
  );
}

export default memo(StartDetail);
