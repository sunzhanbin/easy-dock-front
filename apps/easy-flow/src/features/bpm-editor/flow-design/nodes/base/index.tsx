import { memo, ReactNode, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { Button } from 'antd';
import { Icon, PopoverConfirm } from '@common/components';
import { addNode, delNode, flowDataSelector } from '../../flow-slice';
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

interface CardHeaderProps {
  icon: ReactNode;
  children?: ReactNode;
  className?: string;
  isUserNode?: boolean;
}

export const CardHeader = memo(function CardHeader(props: CardHeaderProps) {
  const { icon, children, className, isUserNode } = props;
  return (
    <div className={classnames(styles.header, className, { [styles.custom]: isUserNode })}>
      <div className={styles['icon-box']}>{icon}</div>
      <div className={styles.title}>{children}</div>
    </div>
  );
});

function Base(props: BaseProps) {
  const dispatch = useDispatch();
  const { invalidNodesMap } = useSelector(flowDataSelector);
  const { icon, node, onClick, children } = props;
  const { type, name } = node;
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
      <div
        className={classnames(styles.card, {
          [styles.invalid]: invalidNodesMap[node.id] && invalidNodesMap[node.id].errors.length > 0,
        })}
        onClick={onClick}
      >
        <CardHeader isUserNode={type === NodeType.UserNode} icon={icon}>
          {node.name}
        </CardHeader>
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
