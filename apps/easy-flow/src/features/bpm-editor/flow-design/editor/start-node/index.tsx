import { memo, useMemo, useState, useEffect } from 'react';
import { Input, Form } from 'antd';
import { FormInstance } from 'rc-field-form';
import moment, { Moment } from 'moment';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { name } from '@common/rule';
import { updateNode } from '../../flow-slice';
import { StartNode, TriggerType, TimingTrigger } from '@type/flow';
import { useAppDispatch } from '@/app/hooks';
import { trimInputValue } from '../../util';
import useValidateForm from '../../hooks/use-validate-form';
import DatePicker from '@/features/bpm-editor/components/date-picker';
import DateRange from '@/features/bpm-editor/components/date-range';
import Frequency from './frequency';
import Trigger from './trigger';
import styles from './index.module.scss';

interface StartNodeEditorProps {
  node: StartNode;
}

type FormValuesType = Pick<StartNode, 'name' | 'trigger'>;

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
        const cycle = trigger.cycleRange || [];

        mapTrigger = {
          type: TriggerType.TIMING,
          startTime: trigger.startTime || Date.now(),
          cycleRange: [cycle[0] || null, cycle[1] || null],
          frequency: trigger.frequency,
        };
        console.info(mapTrigger, 1111);
        // 如果没有设置开始时间默认从现在开始, 下面代码功能回显开始时间
        if (!trigger.startTime) {
          form.setFieldsValue({
            trigger: mapTrigger,
          });
        }
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
    form.setFieldsValue({
      name: node.name,
      trigger: node.trigger,
    });
  }, [node, form]);

  const disabledDate = useMemo(() => {
    return (date: Moment) => {
      return date.isBefore(Date.now(), 'D');
    };
  }, []);

  const cycleRule = useMemo(() => {
    return ({ getFieldValue }: FormInstance) => ({
      required: true,
      validator(_: any, value?: [Moment, Moment]) {
        const [min, max] = value || [];
        const startTime = getFieldValue(['trigger', 'startTime']);

        if (startTime) {
          const mTime = moment(startTime);

          if (mTime.isBefore(min, 'D') || mTime.isAfter(max, 'D')) {
            return Promise.reject(new Error('周期未包含开始时间'));
          }
        }

        return Promise.resolve();
      },
    });
  }, []);

  const FrequencyRule = useMemo(() => {
    return {
      required: true,
      validator(_: any, frequency: TimingTrigger['frequency']) {
        if (!frequency.value) {
          return Promise.reject(new Error('频次不能为空'));
        }

        if (!frequency.unit) {
          return Promise.reject(new Error('频次单位不能为空'));
        }

        return Promise.resolve();
      },
    };
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
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item
            label="周期"
            name={['trigger', 'cycle']}
            dependencies={[['trigger', 'startTime']]}
            rules={[cycleRule]}
          >
            <DateRange />
          </Form.Item>
          <Form.Item label="频次" name={['trigger', 'frequency']} rules={[FrequencyRule]}>
            <Frequency></Frequency>
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
