import { memo, FC } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import styles from './index.module.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

const stateList: { key: number; value: string }[] = [
  {
    key: 1,
    value: '进行中',
  },
  {
    key: 2,
    value: '已终止',
  },
  {
    key: 3,
    value: '已驳回',
  },
  {
    key: 4,
    value: '已办结',
  },
  {
    key: 5,
    value: '已撤回',
  },
];

const Copy: FC<{}> = () => {
  const [form] = Form.useForm();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Form form={form} layout="inline" colon={false} name="copy_form" labelAlign="left" labelCol={{ span: 3.5 }}>
          <Form.Item label="流程名称" name="name" className="name">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="状态" name="state" className="state">
            <Select style={{ width: '100%' }}>
              {stateList.map(({ key, value }) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="抄送人" name="copyer" className="copyer">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="抄送时间" name="timeRange" className="timeRange">
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            ></RangePicker>
          </Form.Item>
        </Form>
        <div className={styles.operation}>
          <Button type="primary" ghost className={styles.search}>
            查询
          </Button>
          <Button ghost className={styles.reset}>
            重置
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(Copy);
