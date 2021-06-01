import { memo, useMemo } from 'react';
import { Input, Form, Space, Button } from 'antd';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { updateNode } from '../../flow-slice';
import { StartNode, TriggerType } from '../../types';
import styles from './index.module.scss';
import { useAppDispatch } from '@/app/hooks';

interface StartNodeEditorProps {
  node: StartNode;
}

const Trigger = memo(function Trigger({
  value,
  onChange,
}: {
  value?: TriggerType;
  onChange?(value: TriggerType): void;
}) {
  const handleValueChange = useMemoCallback((newValue: TriggerType) => {
    if (newValue === value || !onChange) return;

    onChange(newValue);
  });

  return (
    <Space size={0} className={styles.btns}>
      <Button
        size="large"
        className={classnames(styles.manual, styles.button, {
          [styles.active]: value === TriggerType.MANUAL,
        })}
        onClick={() => handleValueChange(TriggerType.MANUAL)}
      >
        人工发起
      </Button>
      <Button
        disabled
        size="large"
        className={classnames(styles.timing, styles.button, {
          [styles.active]: value === TriggerType.TIMING,
        })}
        onClick={() => handleValueChange(TriggerType.TIMING)}
      >
        定时发起
      </Button>
      <Button
        disabled
        size="large"
        className={classnames(styles.signal, styles.button, {
          [styles.active]: value === TriggerType.SIGNAL,
        })}
        onClick={() => handleValueChange(TriggerType.SIGNAL)}
      >
        信号发起
      </Button>
    </Space>
  );
});

function StartNodeEditor(props: StartNodeEditorProps) {
  const { node } = props;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const handleFormValuesChange = useMemoCallback(
    debounce((_, allValues: { name: string; triggerType: TriggerType }) => {
      let trigger: StartNode['trigger'];
      const { name, triggerType } = allValues;

      if (triggerType === TriggerType.SIGNAL) {
        trigger = {
          type: TriggerType.SIGNAL,
        };
      } else if (triggerType === TriggerType.TIMING) {
        trigger = {
          type: TriggerType.TIMING,
        };
      } else {
        trigger = {
          type: TriggerType.MANUAL,
        };
      }

      dispatch(
        updateNode({
          ...node,
          name,
          trigger,
        }),
      );
    }, 100),
  );

  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      triggerType: node.trigger.type,
    };
  }, [node]);
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={formInitialValues}
      onValuesChange={handleFormValuesChange}
    >
      <Form.Item label="节点名称" name="name">
        <Input size="large" placeholder="请输入开始节点名称" />
      </Form.Item>
      <Form.Item label="开始方式" name="triggerType">
        <Trigger />
      </Form.Item>
    </Form>
  );
}

export default memo(StartNodeEditor);
