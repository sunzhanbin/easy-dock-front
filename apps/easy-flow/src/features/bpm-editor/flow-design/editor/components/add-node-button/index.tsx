import { memo, useState, useMemo } from 'react';
import classnames from 'classnames';
import { Button, Popover } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Icon } from '@common/components';
import { addNode } from '../../../flow-slice';
import { getPopupContainer } from '../../../util';
import { NodeType } from '@type/flow';
import styles from './index.module.scss';
import { useAppDispatch } from '@/app/hooks';

interface AddNodeButtonProps {
  prevId: string;
  className?: string;
}

function AddNodeButton(props: AddNodeButtonProps) {
  const { prevId, className } = props;
  const dispatch = useAppDispatch();
  const [showAddPopover, setShowAddPopover] = useState(false);

  const handleAddNode = useMemoCallback((type: NodeType.AuditNode | NodeType.FillNode) => {
    // 将业务逻辑放在redux里处理
    dispatch(addNode({ prevId, type }));
    setShowAddPopover(false);
  });

  const addPopoverContent = useMemo(() => {
    return (
      <div className={styles['add-list']}>
        <div onClick={() => handleAddNode(NodeType.AuditNode)}>
          <Icon type="lineyonghujiedian1" />
          <span>添加审批节点</span>
        </div>
        <div onClick={() => handleAddNode(NodeType.FillNode)}>
          <Icon type="caidan" />
          <span>添加填写节点</span>
        </div>
      </div>
    );
  }, [handleAddNode]);

  return (
    <Popover
      className={styles.popover}
      getPopupContainer={getPopupContainer}
      placement="rightTop"
      arrowContent={null}
      visible={showAddPopover}
      onVisibleChange={setShowAddPopover}
      content={addPopoverContent}
    >
      <div className={classnames(styles.container, className)}>
        <Button className={styles['add-button']} type="default" icon={<Icon type="xinzeng" />} />
      </div>
    </Popover>
  );
}

export default memo(AddNodeButton);
