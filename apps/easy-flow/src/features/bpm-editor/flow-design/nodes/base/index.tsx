import { memo, ReactNode, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Icon, PopoverConfirm } from '@common/components';
import { Button } from 'antd';
import { addNode, delNode } from '../../flow-slice';
import { createNode } from '../../util';
import { NodeType, AllNode, BranchNode } from '../../types';
import styles from './index.module.scss';
interface BaseProps {
  onClick(): void;
  children: ReactNode;
  icon: ReactNode;
  node: Exclude<AllNode, BranchNode>;
  onDelete?(): void;
}

function Base(props: BaseProps) {
  const { icon, node, onClick, children } = props;
  const { type, name } = node;
  const dispatch = useDispatch();
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const handleAddNode = useCallback(() => {
    dispatch(
      addNode({
        prevId: node.id,
        node: createNode(NodeType.UserNode, '用户节点'),
      }),
    );
  }, [node.id, dispatch]);

  const handleDeleteConfirm = useCallback(() => {
    dispatch(delNode(node.id));
  }, [dispatch, node.id]);

  return (
    <div className={styles.node}>
      <div className={styles.card} onClick={onClick}>
        <div className={classnames(styles.header, { [styles.custom]: type === NodeType.UserNode })}>
          <div className={styles['icon-box']}>{icon}</div>
          <div className={styles.title}>{name}</div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>

      {type !== NodeType.FinishNode && (
        <div className={styles.footer}>
          <div className={styles.line} />
          <Button
            className={styles['add-button']}
            onClick={handleAddNode}
            type="default"
            icon={<Icon type="xinzeng" />}
          />
        </div>
      )}
      {type === NodeType.UserNode && (
        <div className={classnames(styles.actions, { [styles.show]: showDeletePopover })}>
          <PopoverConfirm
            title="是否确认删除此节点"
            onConfirm={handleDeleteConfirm}
            visible={showDeletePopover}
            onVisibleChange={setShowDeletePopover}
            trigger="click"
            content={name}
          >
            <div className={styles.action}>
              <Icon type="shanchu" className={styles.icon} />
            </div>
          </PopoverConfirm>
        </div>
      )}
    </div>
  );
}

export default memo(Base);
