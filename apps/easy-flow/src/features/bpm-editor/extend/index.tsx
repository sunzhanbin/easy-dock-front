import { memo, useEffect, useState } from 'react';
import { Location } from 'history';
import { Form, Switch, Checkbox, Button } from 'antd';
import classnames from 'classnames';
import { builderAxios } from '@utils';
import { MemberSelector, Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useSubAppDetail } from '@app/app';
import { TipType } from '@type/subapp';
import styles from './index.module.scss';

interface ExtendConfig {
  openVisit: boolean;
  messageConfig: {
    enableTodo: boolean;
    enableDone: boolean;
    noticeChannels: TipType[];
  };
}

function SubAppExtend() {
  const [form] = Form.useForm<ExtendConfig>();
  const { data } = useSubAppDetail();
  const [loading, setLoading] = useState(true);
  const projectId = data?.app.project.id;
  const handleSubmit = useMemoCallback((values: ExtendConfig) => {
    // builderAxios
  });

  useEffect(() => {
    console.log(form);
  }, [form]);

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      // builderAxios
    }
  }, [projectId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Form form={form} layout="vertical" className={styles.form} onFinish={handleSubmit}>
      <label className={classnames(styles['horizontal-item'], styles['open-visit'])}>
        <span className={styles.text}>所有人可访问</span>
        <Form.Item name="openVisit" noStyle valuePropName="checked">
          <Switch />
        </Form.Item>
      </label>

      <Form.Item label={<div className={styles.label}>流程访问权限设置</div>} name="correlationMemberConfig">
        <MemberSelector projectId={projectId} />
      </Form.Item>

      <Form.Item label="消息设置">
        <Form.Item help="当节点有新的待办事项时（包含转交），对该节点的节点负责人进行提醒">
          <label className={styles['horizontal-item']}>
            <span className={styles.text}>待办消息</span>
            <Form.Item valuePropName="checked" name={['messageConfig', 'enableTodo']} noStyle>
              <Switch />
            </Form.Item>
          </label>
        </Form.Item>

        <Form.Item help="流程结束后，对申请发起人进行申请结果通知，包含：已通过、已拒绝">
          <label className={styles['horizontal-item']}>
            <span className={styles.text}>办结消息</span>
            <Form.Item valuePropName="checked" name={['messageConfig', 'enableDone']} noStyle>
              <Switch />
            </Form.Item>
          </label>
        </Form.Item>
      </Form.Item>

      <Form.Item
        label="提示方式"
        name={['messageConfig', 'noticeChannels']}
        help="仅对上述的提醒类型生效，自定义提醒的提醒方式需要单独设置"
      >
        <Checkbox.Group>
          <Checkbox value={TipType.WeiChat}>微信提示</Checkbox>
          <Checkbox value={TipType.SMS}>短信提示</Checkbox>
          <Checkbox value={TipType.Email}>邮件提示</Checkbox>
          <Checkbox value={TipType.Phone}>语音电话提示</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <Button className={styles.submit} htmlType="submit" type="primary">
        保存
      </Button>
    </Form>
  );
}

export default memo(SubAppExtend, (prevProps: { location: Location }, nextProps: { location: Location }) => {
  return prevProps.location.pathname !== nextProps.location.pathname;
});
