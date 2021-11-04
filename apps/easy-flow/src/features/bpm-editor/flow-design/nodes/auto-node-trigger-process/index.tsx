import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '@common/components';
import BaseNode from '../base-node';
import { AutoNodeTriggerProcess as AutoNodeType } from '@type/flow';
import { apisSelector } from '../../flow-slice';
import styles from './index.module.scss';

interface AutoNodeProps {
  node: AutoNodeType;
}

function AutoNodeTriggerProcess(props: AutoNodeProps) {
  const { node } = props;
  const { dataConfig } = node;
  const flowNames = useMemo(() => {
    if (!dataConfig || !dataConfig.length) {
      return '';
    }
    return dataConfig.map((v) => v.processName).join('、');
  }, [dataConfig]);

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
