import { memo, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Button, Popover } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Icon } from '@common/components';
import { addNode } from '../../../flow-slice';
import { createNode, getPopupContainer } from '../../../util';
import { NodeType } from '../../../types';
import styles from './index.module.scss';

interface AddNodeButtonProps {
  prevId: string;
  className?: string;
}

function AddNodeButton(props: AddNodeButtonProps) {
  const { prevId, className } = props;
  const dispatch = useDispatch();
  const [showAddPopover, setShowAddPopover] = useState(false);

  const handleAddNode = useMemoCallback((type: NodeType, name: string) => {
    let tmpNode;

    if (type === NodeType.AuditNode) {
      tmpNode = createNode(type, name);
    } else if (type === NodeType.FillNode) {
      tmpNode = createNode(type, name);
    } else {
      throw Error('传入类型不正确');
    }

    dispatch(
      addNode({
        prevId,
        node: tmpNode,
      }),
    );

    setShowAddPopover(false);
  });

  const addPopoverContent = useMemo(() => {
    return (
      <div className={styles['add-list']}>
        <div onClick={() => handleAddNode(NodeType.AuditNode, '审批节点')}>
          <Icon type="lineyonghujiedian1" />
          <span>添加审批节点</span>
        </div>
        <div onClick={() => handleAddNode(NodeType.FillNode, '填写节点')}>
          <Icon type="caidan" />
          <span>添加填写节点</span>
        </div>
      </div>
    );
  }, []);

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
