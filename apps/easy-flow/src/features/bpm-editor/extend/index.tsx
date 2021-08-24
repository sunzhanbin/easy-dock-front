import { memo, useEffect, useState, useRef } from 'react';
import { Location } from 'history';
import { Form, Switch, Checkbox } from 'antd';
import classnames from 'classnames';
import { MemberSelector, MemberSelectorProps, Loading, AsyncButton } from '@common/components';
import { builderAxios, runtimeAxios } from '@utils';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useSubAppDetail } from '@app/app';
import { Role, Member, Dept } from '@type';
import { TipType } from '@type/subapp';
import styles from './index.module.scss';

type MembersConfig = NonNullable<MemberSelectorProps['value']>;

interface ExtendConfig {
  members: MembersConfig;
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
  const subappId = data?.id;
  const handleSubmit = useMemoCallback(() => {
    console.log(form.getFieldsValue());
  });

  useEffect(() => {
    if (!subappId) return;

    (async () => {
      setLoading(true);

      try {
        const [members] = await Promise.all([fetMembers(subappId)]);

        form.setFieldsValue({
          members,
          openVisit: true,
          messageConfig: {
            enableDone: true,
            enableTodo: true,
            noticeChannels: [1, 3],
          },
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [subappId, form]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Form form={form} layout="vertical" className={styles.form}>
      <label className={classnames(styles['horizontal-item'], styles['open-visit'])}>
        <span className={styles.text}>所有人可访问</span>
        <Form.Item name="openVisit" noStyle valuePropName="checked">
          <Switch />
        </Form.Item>
      </label>

      <Form.Item label="流程访问权限设置" name="members">
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

      <AsyncButton className={styles.submit} onClick={handleSubmit} type="primary" size="large">
        保存
      </AsyncButton>
    </Form>
  );
}

export default memo(SubAppExtend, (prevProps: { location: Location }, nextProps: { location: Location }) => {
  return prevProps.location.pathname !== nextProps.location.pathname;
});

async function fetMembers(subappId: string | number): Promise<MembersConfig> {
  return runtimeAxios
    .get<{ data: { id: number; ownerType: 1 | 2 | 3; owner: any }[] }>(`/subapp/${subappId}/powers`)
    .then(({ data }) => {
      const members: Member[] = [];
      const depts: Dept[] = [];
      const roles: Role[] = [];

      data.forEach((item) => {
        if (item.ownerType === 1) {
          members.push({
            id: item.owner.id,
            name: item.owner.userName,
            avatar: item.owner.avatar,
          });
        } else if (item.ownerType === 2) {
          roles.push({
            id: item.owner.id,
            name: item.owner.name,
          });
        } else if (item.ownerType === 3) {
          depts.push({
            id: item.owner.id,
            name: item.owner.name,
          });
        }
      });

      return {
        members,
        depts,
        roles,
      };
    });
}
