import { memo, ReactNode, useCallback, useState, useMemo } from 'react';
import classnames from 'classnames';
import { Icon, PopoverConfirm } from '@common/components';
import { delNode, flowDataSelector, setChoosedNode } from '../../flow-slice';
import { NodeType, AllNode, BranchNode } from '@type/flow';
import AddNodeButton from '../../editor/components/add-node-button';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';

interface BaseProps {
  icon: ReactNode;
  node: Exclude<AllNode, BranchNode>;
  onDelete?(): void;
  children: ReactNode;
}

interface CardHeaderProps {
  icon: ReactNode;
  children?: ReactNode;
  className?: string;
  type: NodeType;
}

export const CardHeader = memo(function CardHeader(props: CardHeaderProps) {
  const { icon, children, className, type } = props;

  const typeClass = useMemo(() => {
    if (type === NodeType.AuditNode) {
      return styles['audit-node'];
    } else if (type === NodeType.FillNode) {
      return styles['fill-node'];
    } else if (type === NodeType.CCNode) {
      return styles['cc-node'];
    }

    return '';
  }, [type]);

  return (
    <div className={classnames(styles.header, typeClass, className)}>
      <div className={styles['icon-box']}>{icon}</div>
      <div className={styles.title}>{children}</div>
    </div>
  );
});

function Base(props: BaseProps) {
  const dispatch = useAppDispatch();
  const { invalidNodesMap } = useAppSelector(flowDataSelector);
  const { icon, node, children } = props;
  const { type, name } = node;
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const handleDeleteConfirm = useCallback(() => {
    dispatch(delNode(node.id));
  }, [dispatch, node.id]);
  const handleNodeClick = useMemoCallback(() => {
    dispatch(setChoosedNode(node));
  });

  const showDelete = useMemo(() => {
    return type === NodeType.AuditNode || type === NodeType.FillNode || type === NodeType.CCNode;
  }, [type]);

  return (
    <div className={styles.node}>
      <div
        className={classnames(styles.card, {
          [styles.invalid]: invalidNodesMap[node.id] && invalidNodesMap[node.id].errors.length > 0,
        })}
        onClick={handleNodeClick}
      >
        <CardHeader icon={icon} type={node.type}>
          {node.name}
        </CardHeader>
        <div className={styles.content}>{children}</div>
      </div>

      {type !== NodeType.FinishNode && (
        <div className={styles.footer}>
          <AddNodeButton prevId={node.id} />
        </div>
      )}

      {showDelete && (
        <div className={classnames(styles.actions, { [styles.show]: showDeletePopover })}>
          <PopoverConfirm
            title="确认删除"
            onConfirm={handleDeleteConfirm}
            visible={showDeletePopover}
            onVisibleChange={setShowDeletePopover}
            trigger="click"
            content={`确认删除 ${name} 吗？`}
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
