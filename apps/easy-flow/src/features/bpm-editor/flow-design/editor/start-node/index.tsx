import { memo, useMemo, useState, useEffect } from 'react';
import { Input, Form, Space, Button, DatePicker } from 'antd';
import { FormInstance } from 'rc-field-form';
import moment, { Moment } from 'moment';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { name } from '@common/rule';
import { updateNode } from '../../flow-slice';
import { StartNode, TriggerType } from '@type/flow';
import styles from './index.module.scss';
import { useAppDispatch } from '@/app/hooks';
import { trimInputValue } from '../../util';
import useValidateForm from '../../hooks/use-validate-form';

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
        size="large"
        className={classnames(styles.timing, styles.button, {
          [styles.active]: value === TriggerType.TIMING,
        })}
        onClick={() => handleValueChange(TriggerType.TIMING)}
      >
        定时发起
      </Button>
      <Button
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

type FormValuesType = Pick<StartNode<Moment>, 'name' | 'trigger'>;

function changeMomentToTimes(mtime?: Moment) {
  if (mtime) return mtime.valueOf();

  return 0;
}

function StartNodeEditor(props: StartNodeEditorProps) {
  const { node } = props;
  const [form] = Form.useForm<FormValuesType>();
  const dispatch = useAppDispatch();
  const [triggerType, setTriggerType] = useState(node.trigger.type);

  // 触发保存时校验form
  useValidateForm<FormValuesType>(form);

  const handleFormValuesChange = useMemoCallback(
    debounce((_, allValues: FormValuesType) => {
      let mapTrigger: StartNode['trigger'];
      let { name, trigger } = allValues;

      if (trigger.type === TriggerType.SIGNAL) {
        mapTrigger = {
          type: TriggerType.SIGNAL,
          match: '',
        };
      } else if (trigger.type === TriggerType.TIMING) {
        const cycle = trigger.cycle || [];

        mapTrigger = {
          type: TriggerType.TIMING,
          startTime: changeMomentToTimes(trigger.startTime),
          cycle: [changeMomentToTimes(cycle[0]), changeMomentToTimes(cycle[1])],
        };
      } else {
        mapTrigger = {
          type: TriggerType.MANUAL,
        };
      }

      setTriggerType(trigger.type);

      dispatch(
        updateNode({
          ...node,
          name,
          trigger: mapTrigger,
        }),
      );
    }, 100),
  );

  useEffect(() => {
    const values = {
      name: node.name,
      trigger: {
        type: node.trigger.type,
      },
    } as any;

    if (node.trigger.type === TriggerType.TIMING) {
      const { startTime, cycle = [] } = node.trigger;

      values.trigger.startTime = moment(startTime);
      values.trigger.cycle = [moment(cycle[0]), moment(cycle[1])];
    } else if (node.trigger.type === TriggerType.SIGNAL) {
      values.trigger.match = '';
    }

    form.setFieldsValue(values);
  }, [node, form]);

  const disabledDate = useMemo(() => {
    return (date: Moment) => {
      return date.isBefore(Date.now(), 'D');
    };
  }, []);

  const cycleRule = useMemo(() => {
    return ({ getFieldValue }: FormInstance) => ({
      required: true,
      validator(_: any, value: [Moment, Moment]) {
        const [min, max] = value;
        const startTime = getFieldValue(['trigger', 'startTime']);

        if (startTime && (startTime.isBefore(min, 'D') || startTime.isAfter(max, 'D'))) {
          return Promise.reject(new Error('周期未包含开始时间'));
        }

        return Promise.resolve();
      },
    });
  }, []);

  return (
    <Form
      className={styles.form}
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={handleFormValuesChange}
    >
      <Form.Item label="节点名称" name="name" getValueFromEvent={trimInputValue} rules={[name]}>
        <Input size="large" placeholder="请输入开始节点名称" />
      </Form.Item>
      <Form.Item label="开始方式" name={['trigger', 'type']}>
        <Trigger />
      </Form.Item>

      {triggerType === TriggerType.TIMING && (
        <>
          <Form.Item label="开始时间" name={['trigger', 'startTime']} required>
            <DatePicker showTime size="large" disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item
            label="周期"
            name={['trigger', 'cycle']}
            dependencies={[['trigger', 'startTime']]}
            rules={[cycleRule]}
          >
            <DatePicker.RangePicker size="large" disabledDate={disabledDate} />
          </Form.Item>
        </>
      )}

      {triggerType === TriggerType.SIGNAL && (
        <>
          <Form.Item label="匹配值" name={['trigger', 'match']} required>
            <Input size="large"></Input>
          </Form.Item>
        </>
      )}
    </Form>
  );
}

export default memo(StartNodeEditor);
