import { memo, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import classnames from 'classnames';
import { Loading, AsyncButton, Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import Form from '@components/form-engine';
import Header from '@components/header';
import { axios } from '@utils';
import StatusBar from './components/statusbar';
import { FlowDetailType } from '@type/flow';
import { FlowDetaiDataType } from './type';
import styles from './index.module.scss';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/';
  require('./mock');
}

function FlowDetail() {
  const { subAppId, flowId, type } = useParams<{ subAppId: string; flowId: string; type: string }>();
  const [data, setData] = useState<FlowDetaiDataType>();
  const [loading, setLoading] = useState(true);
  const isValidType = useMemo(() => {
    return type in FlowDetailType;
  }, [type]);

  useEffect(() => {
    setLoading(true);
    console.log(axios.defaults.baseURL);

    axios
      .post<FlowDetaiDataType>(`/runtime/v1/task/instanceDetail`, { processInstanceId: flowId, subappId: subAppId })
      .then((flowResponse) => {
        setData(flowResponse.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [subAppId, flowId]);

  const formVnode = useMemo(() => {
    if (!data) return null;

    const { processMeta, formData, formMeta } = data;

    return <Form data={formMeta} initialValue={formData} fieldsAuths={processMeta.fieldsAuths} />;
  }, [data]);

  const btnsVnode = useMemo(() => {
    if (!data || !data.processMeta) return null;

    if (String(FlowDetailType.MyInitiation) === type) {
      return <AsyncButton size="large">撤回</AsyncButton>;
    }

    if (String(FlowDetailType.MyTodo) === type) {
      return <></>;
    }

    if (String(FlowDetailType.MyFinish) === type) {
      return <></>;
    }

    return null;
  }, [data?.processMeta]);

  const statusNodes = useMemo(() => {
    if (!data) return null;

    const trackNode = (
      <div className={classnames(styles.cell, styles.track)}>
        <div className={styles['cell-content']}>
          <div className={styles['cell-row']}>
            <span>流程用时</span>
            <span>{data.detail.timeUsed}</span>
          </div>
          <div className={styles['cell-row']}>
            <span>流程跟踪</span>
            <Icon type="fabu"></Icon>
          </div>
        </div>
      </div>
    );

    // 我的发起
    if (String(FlowDetailType.MyInitiation) === type) {
      return (
        <>
          <div className={styles.cell}>
            <Icon className={styles['cell-icon']} type="fabu" />
            <div className={styles['cell-content']}>
              <div className={styles['cell-title']}>{data.processMeta.name}</div>
              <div className={styles['cell-desc']}>当前节点</div>
            </div>
          </div>
          <div className={styles.cell}>
            <Icon className={styles['cell-icon']} type="fabu" />
            <div className={styles['cell-content']}>
              <div className={styles['cell-title']}>
                {data.detail.currentProcessor.users.map((user) => user.name).join(',')}
              </div>
              <div className={styles['cell-desc']}>当前处理人</div>
            </div>
          </div>
          {trackNode}
        </>
      );
    }

    return null;
  }, [type, data]);

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      <Header className={styles.header} backText="流程详情">
        <div className={styles.btns}>{btnsVnode}</div>
      </Header>

      {data && (
        <div className={styles.main}>
          <div className={styles.content}>
            <StatusBar status={data.detail.state}>
              <div className={styles.status}>{statusNodes}</div>
            </StatusBar>
            <div className={styles.form}>
              <div className={styles.title}>燃气报修</div>
              <>{formVnode}</>
            </div>
          </div>
          <div className={styles.flow}>流程进度</div>
        </div>
      )}
    </div>
  );
}

export default memo(FlowDetail);
