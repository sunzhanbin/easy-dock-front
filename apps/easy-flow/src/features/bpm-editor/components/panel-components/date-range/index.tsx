import { memo, ReactNode, useMemo } from 'react';
import { DatePicker, Form } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';
import { useAppSelector } from '@app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { DateField } from '@type';
import { Moment } from 'moment';
import { Icon } from '@common/components';

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
    };
    if (formatType === 'YYYY-MM-DD HH:mm:ss') {
      props.showTime = true;
      props.format = 'YYYY-MM-DD HH:mm:ss';
    } else if (formatType === 'YYYY-MM-DD') {
      props.format = 'YYYY-MM-DD';
    } else {
      props.format = 'YYYY-MM-DD';
    }
    return props;
  }, [formatType]);

  console.log(propList, 'ppppp');
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        const isChecked = form.getFieldValue('datelimit');
        if (!isChecked) {
          return null;
        }
        return (
          <div className={styles.dateRange}>
            <p className={styles.tips}>此处限制与表单静态规则冲突时，以表单静态规则为准。</p>
            <div className={styles.limitRange}>
              <Form.Item className={styles.Item} name={[id, 'min']}>
                <DatePicker size="large" placeholder="最早日期" {...propList} />
              </Form.Item>
              <span className={styles.text}>~</span>
              <Form.Item className={styles.Item} name={[id, 'max']}>
                <DatePicker size="large" placeholder="最晚日期" {...propList} />
              </Form.Item>
            </div>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default memo(DateRange);
