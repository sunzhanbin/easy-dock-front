import { memo } from 'react';
import { AsyncButton, Icon } from '@common/components';
import { NodeType } from '@type/flow';
import { TaskDetailType, DetailData } from '../../type';
import styles from './index.module.scss';

interface ActionButtonsProps {
  data: DetailData;
  onSave?(): void;
  onSubmit?(): void;
  onApprove?(): void;
  onTerminate?(): void;
  onRevert?(): void;
}

function ActionButtons(props: ActionButtonsProps) {
  const { data, onSave, onSubmit, onApprove, onTerminate, onRevert } = props;

  // 我的发起
  if (TaskDetailType.MyInitiation === data.task.state) {
    return (
      <AsyncButton size="large" disabled>
        撤回
      </AsyncButton>
    );
  }

  // 我的待办
  if (TaskDetailType.MyTodo === data.task.state) {
    const flowNode = data.flow.node;

    // 填写节点
    if (flowNode.type === NodeType.FillNode) {
      return (
        <div className={styles.btns}>
          {/* 填写节点保存按钮 */}
          <AsyncButton size="large" onClick={onSave}>
            {flowNode.btnText.save.text || '保存'}
          </AsyncButton>

          {/* 填写节点提交按钮 */}
          <AsyncButton type="primary" size="large" icon={<Icon type="fabu" />} onClick={onSubmit}>
            {flowNode.btnText.submit.text || '提交'}
          </AsyncButton>
        </div>
      );

      // 审批节点
    } else if (flowNode.type === NodeType.AuditNode) {
      return (
        <div className={styles.btns}>
          {/* 审批节点的终止按钮 */}
          {flowNode.btnText.terminate?.enable && (
            <AsyncButton size="large" onClick={onTerminate}>
              {flowNode.btnText.terminate.text || '终止'}
            </AsyncButton>
          )}

          {/* 审批节点的转办按钮本期不做 */}
          {/* {flowNode.btnText.transfer?.enable && (
            <AsyncButton size="large">{flowNode.btnText.transfer.text || '转办'}</AsyncButton>
          )} */}

          {/* 审批节点的保存按钮 */}
          {flowNode.btnText.save?.enable && (
            <AsyncButton size="large" className={styles.save} onClick={onSave}>
              {flowNode.btnText.save.text || '保存'}
            </AsyncButton>
          )}

          {/* 审批节点的驳回按钮 */}
          {flowNode.btnText.revert?.enable && (
            <AsyncButton type="primary" danger size="large" onClick={onRevert}>
              {flowNode.btnText.revert.text || '驳回'}
            </AsyncButton>
          )}

          {/* 审批节点的同意按钮 */}
          {flowNode.btnText.approve?.enable && (
            <AsyncButton type="primary" size="large" onClick={onApprove}>
              {flowNode.btnText.approve.text || '同意'}
            </AsyncButton>
          )}
        </div>
      );
    }
  }

  return null;
}

export default memo(ActionButtons);
