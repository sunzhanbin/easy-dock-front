import { memo, ReactNode, useState } from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import { BranchNode as BranchNodeType } from '@type/flow';
import { Icon, PopoverConfirm } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useAppDispatch } from '@/app/hooks';
import { delNode, addSubBranch, delSubBranch, setChoosedNode } from '../../flow-slice';
import AddNodeButton from '../../editor/components/add-node-button';
import styles from './index.module.scss';
import { formatCondition } from '@utils';

type BranchType = BranchNodeType['branches'][number];

interface BranchNodeProps {
  data: BranchNodeType;
  children?: ReactNode;
}

interface BranchProps {
  data: BranchType;
  children?: ReactNode;
  parentNode: BranchNodeType;
}

export const Branch = memo(function Branch(props: BranchProps) {
  const dispatch = useAppDispatch();
  const { data, parentNode, children } = props;
  const [showDeletePopover, setShowDeletePopover] = useState(false);

  // 删除子分支时判断下是否只有两个子分支
  const handleDeleteBranch = useMemoCallback(() => {
    if (parentNode.branches.length === 2) {
      dispatch(delNode(parentNode.id));
    } else {
      dispatch(delSubBranch({ branchNode: parentNode, targetId: data.id }));
    }
  });

  // 触发编辑子分支
  const handleBranchClick = useMemoCallback(() => {
    dispatch(setChoosedNode(data));
  });

  return (
    <div className={classnames(styles.branch)}>
      <div className={styles.main}>
        <div className={classnames(styles.content, showDeletePopover ? styles['show-del'] : '')}>
          <div className={styles.conditions} onClick={handleBranchClick}>
            <div className={styles.detail}>
              {/* {data.conditions.map((item) => {
                return (
                  <div>
                    {item.map((condition) => {
                      return (
                        <div>
                          <span>{condition.field}</span>
                          <span>{condition.field}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })} */}
            </div>
            <div className={styles.desc}>
              <span>配置筛选条件</span>
            </div>
          </div>
          <PopoverConfirm
            onConfirm={handleDeleteBranch}
            title="确认删除"
            visible={showDeletePopover}
            onVisibleChange={setShowDeletePopover}
            trigger="click"
            content={`确认删除该分支吗？`}
          >
            <div className={styles.action}>
              <Icon type="shanchu" className={styles.icon} />
            </div>
          </PopoverConfirm>
        </div>

        <div className={styles.footer}>
          <AddNodeButton prevId={data.id}></AddNodeButton>
        </div>
        <span className={styles.line}></span>
      </div>

      {children}
      <div className={styles.stretch}></div>
    </div>
  );
});

function BranchNode(props: BranchNodeProps) {
  const { data, children } = props;
  const dispatch = useAppDispatch();
  const handleAddBranch = useMemoCallback(() => {
    dispatch(addSubBranch(data));
  });

  return (
    <div className={styles['branch-node']}>
      <Button
        className={classnames(styles['add-branch-button'])}
        type="primary"
        icon={<Icon type="guanbi" />}
        onClick={handleAddBranch}
      />
      <div className={styles.branchs}>{children}</div>
      <div className={styles.footer}>
        <AddNodeButton prevId={data.id}></AddNodeButton>
      </div>
    </div>
  );
}

export default memo(BranchNode);
