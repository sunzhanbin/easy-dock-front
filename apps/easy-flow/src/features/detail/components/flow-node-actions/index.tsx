import { memo } from 'react';
import { AsyncButton, Icon } from '@common/components';
import { NodeType } from '@type/flow';
import { FlowMeta } from '@type/detail';
import styles from './index.module.scss';

interface ActionButtonsProps {
  flowMeta: FlowMeta;
  operable?: boolean;
  onSave?(): void;
  onSubmit?(): void;
  onApprove?(): void;
  onTerminate?(): void;
  onRevert?(): void;
}

function ActionButtons(props: ActionButtonsProps) {
  const { flowMeta, operable, onSave, onSubmit, onApprove, onTerminate, onRevert } = props;

  if (operable) {
    // 填写节点
    if (flowMeta.type === NodeType.FillNode) {
      return (
        <div className={styles.btns}>
          {/* 填写节点保存按钮 */}
          <AsyncButton size="large" onClick={onSave}>
            {flowMeta.btnText.save.text || '保存'}
          </AsyncButton>

          {/* 填写节点提交按钮 */}
          <AsyncButton type="primary" size="large" icon={<Icon type="fabu" />} onClick={onSubmit}>
            {flowMeta.btnText.submit.text || '提交'}
          </AsyncButton>
        </div>
      );

      // 审批节点
    } else if (flowMeta.type === NodeType.AuditNode) {
      return (
        <div className={styles.btns}>
          {/* 审批节点的终止按钮 */}
          {flowMeta.btnText.terminate?.enable && (
            <AsyncButton size="large" onClick={onTerminate}>
              {flowMeta.btnText.terminate.text || '终止'}
            </AsyncButton>
          )}

          {/* 审批节点的转办按钮本期不做 */}
          {/* {flowNode.btnText.transfer?.enable && (
            <AsyncButton size="large">{flowNode.btnText.transfer.text || '转办'}</AsyncButton>
          )} */}

          {/* 审批节点的保存按钮 */}
          {flowMeta.btnText.save?.enable && (
            <AsyncButton size="large" className={styles.save} onClick={onSave}>
              {flowMeta.btnText.save.text || '保存'}
            </AsyncButton>
          )}

          {/* 审批节点的驳回按钮 */}
          {flowMeta.btnText.revert?.enable && (
            <AsyncButton type="primary" danger size="large" onClick={onRevert}>
              {flowMeta.btnText.revert.text || '驳回'}
            </AsyncButton>
          )}

          {/* 审批节点的同意按钮 */}
          {flowMeta.btnText.approve?.enable && (
            <AsyncButton type="primary" size="large" onClick={onApprove}>
              {flowMeta.btnText.approve.text || '同意'}
            </AsyncButton>
          )}
        </div>
      );
    }
  }

  return null;
}

export default memo(ActionButtons);
