import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '@common/components';
import BaseNode from '../base-node';
import { AutoNode as AutoNodeType } from '@type/flow';
import { apisSelector } from '../../flow-slice';
import styles from './index.module.scss';

interface AutoNodeProps {
  node: AutoNodeType;
}

function AutoNode(props: AutoNodeProps) {
  const { node } = props;
  const apis = useSelector(apisSelector);
  const api = node.dataConfig?.api;

  const apiName = useMemo(() => {
    const target = apis.find((item) => {
      if (item.id === api) return true;

      return false;
    });

    if (target) return target.name;

    return '';
  }, [api, apis]);

  return (
    <BaseNode node={node} icon={<Icon type="zidongjiediandise" />}>
      {apiName ? (
        <div className={styles.api}>
          <span className={styles.desc}>接收数据接口</span>
          <span className={styles.name}>{apiName}</span>
        </div>
      ) : (
        '请设置此节点'
      )}
    </BaseNode>
  );
}

export default memo(AutoNode);
