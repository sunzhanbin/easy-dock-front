import { memo, ReactNode, useMemo } from 'react';
import { Input, Button, Checkbox, Cascader } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { UserNode, ButtonAuth, AllNode, BranchNode, NodeType, RevertType } from '../../../types';
import styles from './index.module.scss';

interface ButtonEditorProps extends ButtonAuth {
  onChange(config: ButtonAuth): void;
  children: ReactNode;
}

const ButtonEditor = memo(function ButtonEditor(props: ButtonEditorProps) {
  const { text, enable, children, onChange } = props;

  return (
    <div className={styles['btn-editor']}>
      <div className={styles['btn-content']}>{children}</div>
      <Input
        className={styles['btn-alias']}
        value={text}
        placeholder="请输入按钮别名"
        onChange={(event) => {
          onChange({ text: event.target.value.trim(), enable: enable || false });
        }}
        size="large"
      />
      <Checkbox
        className={styles.choose}
        checked={enable}
        onChange={(event) => {
          onChange({ text, enable: event.target.checked });
        }}
      />
    </div>
  );
});

interface ButtonConfigsProps {
  value?: {
    btnText: NonNullable<UserNode['btnText']>;
    revert: UserNode['revert'];
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
  const { btnText, revert } = value || {};
  const showRevert = btnText?.revert?.enable;
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
    if (!options.length) {
      return [];
    }

    if (value?.revert) {
      const { type, nodeId } = value.revert;

      if (nodeId) {
        return [type, nodeId];
      } else {
        return [type];
      }
    }

    return [options[0].value];
  }, [value?.revert?.nodeId, options]);

  const cascaderValueDisplay = useMemo(() => {
    return function (labels: string[]) {
      return labels[labels.length - 1];
    };
  }, [options]);

  const handleRevertNodeChange = useMemoCallback((value: CascaderValueType) => {
    if (!onChange || !btnText) return;

    const revert: UserNode['revert'] = {
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

  return (
    <div className={styles['btn-configs']}>
      <div className={styles.header}>
        <div>按钮名称</div>
        <div>选择</div>
      </div>
      <ButtonEditor
        text={btnText?.submit?.text}
        enable={btnText?.submit?.enable}
        onChange={(config) =>
          onChange!({
            ...value,
            btnText: {
              ...btnText,
              submit: config,
            },
            revert,
          })
        }
      >
        <Button size="large">提交</Button>
      </ButtonEditor>

      <ButtonEditor
        text={btnText?.save?.text}
        enable={btnText?.save?.enable}
        onChange={(config) =>
          onChange!({
            ...value,
            btnText: {
              ...btnText,
              save: config,
            },
            revert,
          })
        }
      >
        <Button size="large">保存</Button>
      </ButtonEditor>

      <ButtonEditor
        text={btnText?.approve?.text}
        enable={btnText?.approve?.enable}
        onChange={(config) =>
          onChange!({
            ...value,
            btnText: {
              ...btnText,
              approve: config,
            },
            revert,
          })
        }
      >
        <Button size="large" className={styles.approve}>
          同意
        </Button>
      </ButtonEditor>

      <ButtonEditor
        text={btnText?.revert?.text}
        enable={btnText?.revert?.enable}
        onChange={(config) => {
          onChange!({
            ...value,
            btnText: {
              ...btnText,
              revert: config,
            },
            revert: config.enable && !revert ? { type: RevertType.Start } : revert,
          });
        }}
      >
        <Button size="large" type="primary" danger>
          驳回
        </Button>
      </ButtonEditor>

      {showRevert && (
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
      )}

      <ButtonEditor
        text={btnText?.transfer?.text}
        enable={btnText?.transfer?.enable}
        onChange={(config) =>
          onChange!({
            ...value,
            btnText: {
              ...btnText,
              transfer: config,
            },
            revert,
          })
        }
      >
        <Button size="large">转办</Button>
      </ButtonEditor>

      <ButtonEditor
        text={btnText?.finish?.text}
        enable={btnText?.finish?.enable}
        onChange={(config) =>
          onChange!({
            ...value,
            btnText: {
              ...btnText,
              finish: config,
            },
            revert,
          })
        }
      >
        <Button size="large">终止</Button>
      </ButtonEditor>
    </div>
  );
}

export default memo(ButtonConfigs);
