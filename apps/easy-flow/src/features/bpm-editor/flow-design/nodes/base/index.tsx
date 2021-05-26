import { memo, ReactNode, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { Button, Popover } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
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
        prevId: node.id,
        node: tmpNode,
      }),
    );

    setShowAddPopover(false);
  });

  const handleDeleteConfirm = useCallback(() => {
    dispatch(delNode(node.id));
  }, [dispatch, node.id]);

  const addPopoverContent = useMemo(() => {
    return (
      <div className={styles.adds}>
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
    <div className={styles.node}>
      <div
        className={classnames(styles.card, {
          [styles.invalid]: invalidNodesMap[node.id] && invalidNodesMap[node.id].errors.length > 0,
        })}
        onClick={onClick}
      >
        <CardHeader isUserNode={type === NodeType.AuditNode} icon={icon}>
          {node.name}
        </CardHeader>
        <div className={styles.content}>{children}</div>
      </div>

      {type !== NodeType.FinishNode && (
        <div className={styles.footer}>
          <div className={styles.line} />
          <Popover
            className={styles.popover}
            getPopupContainer={(c) => c}
            placement="rightTop"
            arrowContent={null}
            visible={showAddPopover}
            onVisibleChange={setShowAddPopover}
            content={addPopoverContent}
          >
            <div>
              <Button
                className={styles['add-button']}
                type="default"
                icon={<Icon type="xinzeng" />}
              />
            </div>
          </Popover>
        </div>
      )}
      {type === NodeType.AuditNode && (
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
