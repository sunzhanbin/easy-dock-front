import { ReactNode, memo, useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import momnent from 'moment';
import classnames from 'classnames';
import { message, FormInstance } from 'antd';
import { Loading, AsyncButton, Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import FormEngine from '@components/form-engine';
import ConfirmModal from './components/confirm-modal';
import Header from '@components/header';
import { axios } from '@utils';
import StatusBar from './components/statusbar';
import AuditRecord from './components/audit-record';
import { FlowDetailType, NodeStatusType, NodeType, FormValue } from '@type/flow';
import { FlowDetaiDataType } from './type';
import emptyImage from '@assets/empty.png';
import styles from './index.module.scss';

if (process.env.NODE_ENV === 'development') {
  // axios.defaults.baseURL = '/';
  require('./mock');
}

interface CellProps {
  title: string | ReactNode;
  icon?: string;
  desc: string | ReactNode;
}

const Cell = memo(function Cell(props: CellProps) {
  const { title, icon, desc } = props;
  return (
    <div className={styles.cell}>
      {icon && <Icon className={styles['cell-icon']} type={icon} />}
      <div className={styles['cell-content']}>
        <div className={styles['cell-title']}>{title}</div>
        <div className={styles['cell-desc']}>{desc}</div>
      </div>
    </div>
  );
});

function FlowDetail() {
  const { subAppId, flowId, type } = useParams<{ subAppId: string; flowId: string; type: string }>();
  const [data, setData] = useState<FlowDetaiDataType>();
  const [loading, setLoading] = useState(false);
  const [showConfirmType, setShowConfirmType] = useState<0 | 1 | 2>(); // 1驳回 2同意
  const formRef = useRef<FormInstance<FormValue>>(null);
  const isValidType = useMemo(() => {
    return type in FlowDetailType;
  }, [type]);

  useEffect(() => {
    if (!isValidType) return;

    setLoading(true);

    axios
      .post<FlowDetaiDataType>(`/runtime/v1/task/instanceDetail`, { processInstanceId: flowId, subappId: subAppId })
      .then((flowResponse) => {
        setData(flowResponse.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [subAppId, flowId, isValidType]);

  const formVnode = useMemo(() => {
    if (!data) return null;

    const { processMeta, formData, formMeta } = data;
    const formValue: FormValue = {};

    formMeta.components.forEach((comp) => {
      const compId = comp.id!;

      if (formData[compId] === undefined || formData[compId] === null) {
        formValue[compId] = undefined;
      } else {
        formValue[compId] = formData[compId];
      }
    });

    return <FormEngine ref={formRef} data={formMeta} initialValue={formValue} fieldsAuths={processMeta.fieldsAuths} />;
  }, [data]);

  // const handleSave = useMemoCallback(() => {});

  const btnsVnode = useMemo(() => {
    if (!data) return null;

    if (String(FlowDetailType.MyInitiation) === type) {
      return (
        <AsyncButton size="large" disabled>
          撤回
        </AsyncButton>
      );
    }

    if (String(FlowDetailType.MyTodo) === type) {
      const flowNode = data.processMeta;

      if (flowNode.type === NodeType.FillNode) {
        return (
          <>
            {/* 填写节点保存按钮 */}
            {flowNode.btnText?.save?.enable && (
              <AsyncButton size="large">{flowNode.btnText.save.text || '保存'}</AsyncButton>
            )}

            {/* 填写节点提交按钮 */}
            {flowNode.btnText?.submit?.enable && (
              <AsyncButton type="primary" size="large" icon={<Icon type="fabu" />}>
                {flowNode.btnText.submit.text || '提交'}
              </AsyncButton>
            )}
          </>
        );
      } else if (flowNode.type === NodeType.AuditNode) {
        return (
          <>
            {/* 审批节点的终止按钮 */}
            {flowNode.btnText.terminate?.enable && (
              <AsyncButton size="large">{flowNode.btnText.terminate.text || '终止'}</AsyncButton>
            )}

            {/* 审批节点的转办按钮本期不做 */}
            {/* {flowNode.btnText.transfer?.enable && (
              <AsyncButton size="large">{flowNode.btnText.transfer.text || '转办'}</AsyncButton>
            )} */}

            {/* 审批节点的保存按钮 */}
            {flowNode.btnText.save?.enable && (
              <AsyncButton size="large" className={styles.save}>
                {flowNode.btnText.save.text || '保存'}
              </AsyncButton>
            )}

            {/* 审批节点的驳回按钮 */}
            {flowNode.btnText.revert?.enable && (
              <AsyncButton type="primary" danger size="large" onClick={() => setShowConfirmType(1)}>
                {flowNode.btnText.revert.text || '驳回'}
              </AsyncButton>
            )}

            {/* 审批节点的同意按钮 */}
            {flowNode.btnText.approve?.enable && (
              <AsyncButton type="primary" size="large" onClick={() => setShowConfirmType(2)}>
                {flowNode.btnText.approve.text || '同意'}
              </AsyncButton>
            )}
          </>
        );
      }
    }

    return null;
  }, [data, type]);

  const statusContent = useMemo(() => {
    if (!data) return null;

    const trackNode = (
      <div className={styles.track}>
        <span>流程跟踪</span>
        <Icon type="jinru" />
      </div>
    );

    // 办结状态显示
    if (data.detail.state === NodeStatusType.Finish) {
      return (
        <div className={classnames(styles.status, styles.finish)}>
          <Cell title={data.detail.timeUsed} desc="流程耗时" />

          <div>{trackNode}</div>
        </div>
      );
    }

    const trackCell = (
      <Cell
        title={<div className={styles['time-used']}>{`流程用时 ${data.detail.timeUsed}`}</div>}
        desc={trackNode}
      ></Cell>
    );

    // 我的发起
    if (String(FlowDetailType.MyInitiation) === type) {
      return (
        <div className={styles.status}>
          <Cell icon="dangqianjiedian" title={data.processMeta.name} desc="当前节点" />
          <Cell
            icon="dangqianchuliren"
            title={data.detail.currentProcessor.users.map((user) => user.name).join(',')}
            desc="当前处理人"
          />

          {trackCell}
        </div>
      );
    }

    return (
      <div className={styles.status}>
        <Cell icon="dangqianchuliren" title={data.detail.applyUser} desc="申请人" />
        <Cell
          icon="xuanzeshijian"
          title={momnent(Number(data.detail.applyTime)).format('YYYY-MM-DD HH:mm:ss')}
          desc="申请时间"
        />

        {trackCell}
      </div>
    );
  }, [type, data]);

  const handleConfirm = useMemoCallback(async (remark: string) => {
    if (!formRef.current || !data) return;

    const values = await formRef.current.validateFields();

    console.log(values);
    // 同意
    if (showConfirmType === 2) {
      await new Promise((r) => {
        setTimeout(r, 1000);
      });
    } else {
      // 驳回
      await new Promise((r) => {
        setTimeout(r, 1000);
      });
    }

    setShowConfirmType(0);
    message.success('操作成功');
  });

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      <Header className={styles.header} backText="流程详情">
        <div className={styles.btns}>{btnsVnode}</div>
      </Header>

      {(isValidType && data && (
        <div className={styles.main}>
          <div className={styles.content}>
            <StatusBar status={data.detail.state}>{statusContent}</StatusBar>
            <div className={styles.form}>
              <div className={styles.title}>燃气报修</div>
              <>{formVnode}</>
            </div>
          </div>
          <div className={styles.flow}>
            <div className={styles.detail}>
              {data.auditRecords.map((record) => (
                <AuditRecord key={record.auditTime} data={record} />
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
          visble={showConfirmType > 0}
          isApprove={showConfirmType === 2}
          onCanel={() => {
            setShowConfirmType(0);
          }}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default memo(FlowDetail);
