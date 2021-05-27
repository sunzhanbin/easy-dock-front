import { memo, useMemo } from 'react';
import { Button, Cascader } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';
import useMemoCallback from '@common/hooks/use-memo-callback';
import ButtonEditor from '../../components/button-editor';
import { AuditNode, AllNode, BranchNode, NodeType, RevertType, ButtonAuth } from '../../../types';
import styles from './index.module.scss';

interface ButtonConfigsProps {
  value?: {
    btnText: NonNullable<AuditNode['btnText']>;
    revert: AuditNode['revert'];
  };
  prevNodes: AllNode[];
  onChange?(value: this['value']): void;
}

type RevertOptionsType = {
  value: string | number;
  label: string;
  children?: RevertOptionsType[];
};

function ButtonConfigs(props: ButtonConfigsProps) {
  const { value, onChange, prevNodes } = props;
  const { btnText, revert } = value!;
  const options = useMemo(() => {
    const nodes = prevNodes.filter((subNode) => subNode.type !== NodeType.BranchNode) as Exclude<
      AllNode,
      BranchNode
    >[];

    const opts: RevertOptionsType[] = [
      {
        value: RevertType.Start,
        label: '驳回到发起节点',
      },
      {
        value: RevertType.Prev,
        label: '驳回到上一节点',
      },
    ];

    opts.push({
      value: RevertType.Specify,
      label: '驳回到指定节点',
      children: nodes.map((n) => ({ value: n.id, label: n.name })),
    });

    return opts;
  }, [prevNodes]);

  const cascaderValue = useMemo(() => {
    const { type, nodeId } = revert;

    if (nodeId) {
      return [type, nodeId];
    } else {
      return [type];
    }
  }, [revert.nodeId]);

  const cascaderValueDisplay = useMemo(() => {
    return function (labels: string[]) {
      return labels[labels.length - 1];
    };
  }, [options]);

  const handleRevertNodeChange = useMemoCallback((value: CascaderValueType) => {
    if (!onChange || !btnText) return;

    const revert: AuditNode['revert'] = {
      type: value[0] as RevertType,
    };

    if (value.length > 1) {
      revert.nodeId = value[value.length - 1] as string;
    }

    onChange({
      btnText,
      revert,
    });
  });

  const handleButtonChange = useMemoCallback(
    (key: keyof AuditNode['btnText'], config: ButtonAuth) => {
      if (!onChange) return;

      onChange({ btnText: Object.assign({}, btnText, { [key]: config }), revert });
    },
  );

  return (
    <div className={styles['btn-configs']}>
      <ButtonEditor
        className={styles.editor}
        text={btnText.save.text}
        enable={btnText.save.enable}
        cancelable={false}
        btnKey="save"
        onChange={handleButtonChange}
      >
        <Button size="large">保存</Button>
      </ButtonEditor>

      <ButtonEditor
        className={styles.editor}
        text={btnText?.approve?.text}
        enable={btnText?.approve?.enable}
        cancelable={false}
        btnKey="approve"
        onChange={handleButtonChange}
      >
        <Button size="large" className={styles.approve}>
          同意
        </Button>
      </ButtonEditor>

      <ButtonEditor
        className={styles.editor}
        text={btnText?.revert?.text}
        enable={btnText?.revert?.enable}
        cancelable={false}
        btnKey="revert"
        onChange={handleButtonChange}
      >
        <Button size="large" type="primary" danger>
          驳回
        </Button>
      </ButtonEditor>

      <Cascader
        className={styles.cascader}
        onChange={handleRevertNodeChange}
        getPopupContainer={(c) => c}
        options={options}
        value={cascaderValue}
        expandTrigger="hover"
        displayRender={cascaderValueDisplay}
        size="large"
        allowClear={false}
      />

      <ButtonEditor
        className={styles.editor}
        text={btnText?.transfer?.text}
        enable={btnText?.transfer?.enable}
        btnKey="transfer"
        onChange={handleButtonChange}
      >
        <Button size="large">转办</Button>
      </ButtonEditor>

      <ButtonEditor
        className={styles.editor}
        text={btnText.terminate?.text}
        enable={btnText.terminate?.enable}
        btnKey="terminate"
        onChange={handleButtonChange}
      >
        <Button size="large">终止</Button>
      </ButtonEditor>
    </div>
  );
}

export default memo(ButtonConfigs);
