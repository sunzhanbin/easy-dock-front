import { memo, useMemo } from 'react';
import { Icon } from '@common/components';
import BaseNode from '../base-node';
import { AutoNodeTriggerProcess as AutoNodeType } from '@type/flow';
import styles from './index.module.scss';

interface AutoNodeProps {
  node: AutoNodeType;
}

function AutoNodeTriggerProcess(props: AutoNodeProps) {
  const { node } = props;
  const { triggerConfig } = node;
  const flowNames = useMemo(() => {
    if (!triggerConfig || !triggerConfig.length) {
      return '';
    }
    return triggerConfig.map((v) => v.processName).join('、');
  }, [triggerConfig]);

  return (
    <BaseNode node={node} icon={<Icon type="zidongjiediandise" />}>
      {flowNames ? (
        <div className={styles.api}>
          <span className={styles.desc}>触发流程</span>
          <span className={styles.name}>{flowNames}</span>
        </div>
      ) : (
        '请设置此节点'
      )}
    </BaseNode>
  );
}

export default memo(AutoNodeTriggerProcess);
