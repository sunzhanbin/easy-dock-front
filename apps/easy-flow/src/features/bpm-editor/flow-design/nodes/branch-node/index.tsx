import { memo, ReactNode, useState, useMemo } from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import { FormField } from '@type';
import { BranchNode as BranchNodeType } from '@type/flow';
import { Icon, PopoverConfirm } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  delNode,
  addSubBranch,
  delSubBranch,
  setChoosedNode,
  formMetaSelector,
  flowDataSelector,
} from '../../flow-slice';
import AddNodeButton from '../../components/add-node-button';
import { formatRuleValue } from '@utils';
import styles from './index.module.scss';

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

type FormFieldMapType = { [key: string]: FormField };

export const Branch = memo(function Branch(props: BranchProps) {
  const dispatch = useAppDispatch();
  const { invalidNodesMap } = useAppSelector(flowDataSelector);
  const { data, parentNode, children } = props;
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const formMeta = useAppSelector(formMetaSelector);

  const formFieldsMap: FormFieldMapType = useMemo(() => {
    if (!formMeta) return {};

    return formMeta.components.reduce((map, next) => {
      map[next.config.fieldName] = Object.assign({}, next.config, next.props) as FormField;

      return map;
    }, {} as FormFieldMapType);
  }, [formMeta]);

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

  const conditions = useMemo(() => {
    return data.conditions.filter((condition) => {
      let empty = true;

      condition.forEach((item) => {
        const { fieldName, symbol } = item;

        if (fieldName || symbol) {
          empty = false;
        }
      });

      return !empty;
    });
  }, [data.conditions]);

  const hasValidCondition = useMemo(() => {
    if (invalidNodesMap[data.id] && invalidNodesMap[data.id].errors.length > 0) {
      return true;
    }

    return false;
  }, [invalidNodesMap, data.id]);

  return (
    <div className={classnames(styles.branch)}>
      <span className={styles.line} />

      <div className={styles.main}>
        <div className={classnames(styles.content, showDeletePopover ? styles['show-del'] : '')}>
          <div
            className={classnames(styles.conditions, hasValidCondition ? styles['invalid'] : '')}
            onClick={handleBranchClick}
          >
            {conditions.length === 0 ? (
              <div className={styles.or}>
                <div className={styles.and}>所有数据都可进入该分支</div>
              </div>
            ) : (
              conditions.map((condition, cIndex) => {
                return (
                  <div key={cIndex} className={styles.or}>
                    {condition.map((and, index) => {
                      if (!formFieldsMap[and.fieldName]) {
                        return null;
                      }

                      const { value, symbol, name } = formatRuleValue(and, formFieldsMap[and.fieldName]);

                      return (
                        <div key={index} className={styles.and}>
                          <span className={styles.name}>{name}</span>
                          <span className={styles.symbol}>{symbol}</span>
                          <span>{value}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
            <div className={styles.desc}>
              <Icon type="peizhi" />
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
      </div>

      {children}
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
