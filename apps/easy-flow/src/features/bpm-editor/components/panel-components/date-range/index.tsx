import { memo, ReactNode, useMemo } from 'react';
import { Form } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';
import { useAppSelector } from '@app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { DateField } from '@type';
import { Moment } from 'moment';
import { Icon } from '@common/components';
import DatePicker from '../../date-picker';
import { FormInstance } from 'antd/es';

interface DateRangeProps {
  id: string;
  componentId: string;
}

const DateRange = ({ id, componentId }: DateRangeProps) => {
  const byId = useAppSelector(componentPropsSelector);
  const formatType = useMemo(() => {
    return (byId[componentId] as DateField)?.format;
  }, [componentId, byId]);
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | Function | Moment | ReactNode } = {
      size: 'large',
      suffixIcon: <Icon type="riqi" />,
      onChange: (v: Moment) => void 0,
    };
    if (formatType === 'YYYY-MM-DD HH:mm:ss') {
      props.showTime = true;
      props.format = 'YYYY-MM-DD HH:mm:ss';
    } else if (formatType === 'YYYY-MM-DD') {
      props.showTime = false;
      props.format = 'YYYY-MM-DD';
    } else {
      props.showTime = false;
      props.format = 'YYYY-MM-DD';
    }
    return props;
  }, [formatType]);

  const handleDisabledDate = (current: Moment, index: string, form: FormInstance) => {
    const {
      datelimit: { daterange },
    } = form.getFieldsValue();
    if (index === 'prev' && daterange.max) {
      return current && current > daterange.max;
    } else if (index === 'next' && daterange.min) {
      return current && current < daterange.min;
    }
    return false;
  };

  return (
    <Form.Item noStyle shouldUpdate>
      {(form: FormInstance<any>) => {
        const isChecked = form.getFieldValue('datelimit');
        if (!isChecked || !isChecked.enable) {
          return null;
        }
        return (
          <div className={styles.dateRange}>
            <p className={styles.tips}>此处限制与表单静态规则冲突时，以表单静态规则为准。</p>
            <div className={styles.limitRange}>
              <Form.Item
                className={styles.Item}
                name={['datelimit', id, 'min']}
                rules={[
                  {
                    validator(_: any, value: number) {
                      if (!form.getFieldValue(['datelimit', id, 'max']) && !value) {
                        return Promise.reject(new Error('请选择日期范围'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  placeholder="最早日期"
                  {...propList}
                  type="startTime"
                  disabledDate={(v: Moment) => handleDisabledDate(v, 'prev', form)}
                  onChange={() => {
                    form.validateFields([['datelimit', id, 'max']]);
                  }}
                />
              </Form.Item>
              <span className={styles.text}>~</span>
              <Form.Item
                className={styles.Item}
                name={['datelimit', id, 'max']}
                rules={[
                  {
                    validator(_: any, value: number) {
                      if (!form.getFieldValue(['datelimit', id, 'min']) && !value) {
                        return Promise.reject(new Error('请选择日期范围'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  placeholder="最晚日期"
                  {...propList}
                  type="endTime"
                  disabledDate={(v: Moment) => handleDisabledDate(v, 'next', form)}
                  onChange={() => {
                    form.validateFields([['datelimit', id, 'min']]);
                  }}
                />
              </Form.Item>
            </div>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default memo(DateRange);
