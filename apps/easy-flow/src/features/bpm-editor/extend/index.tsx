import { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Location } from 'history';
import { Form, Switch, Checkbox } from 'antd';
import classnames from 'classnames';
import { MemberSelector, Loading, AsyncButton } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useSubAppDetail, loadExtend, SubAppState, setDirty, setExtend, save } from '@app/app';
import { TipType } from '@type/subapp';
import styles from './index.module.scss';

function SubAppExtend() {
  const [form] = Form.useForm<SubAppState['extend']>();
  const dispatch = useDispatch();
  const subapp = useSubAppDetail();
  const handleSubmit = useMemoCallback(async () => {
    await dispatch(save());
  });

  useEffect(() => {
    if (subapp.data?.id) {
      dispatch(loadExtend(subapp.data.id))
        .then(unwrapResult)
        .then((data) => {
          form.setFieldsValue(data);
        });
    }
  }, [subapp.data?.id, dispatch, form]);

  const handleExtendChange = useMemoCallback((_: any, values: SubAppState['extend']) => {
    dispatch(setDirty(true));
    dispatch(setExtend(values));
  });

  return (
    <Form form={form} layout="vertical" className={styles.form} onValuesChange={handleExtendChange}>
      {subapp.loading && <Loading />}
      <label className={classnames(styles['horizontal-item'], styles['open-visit'])}>
        <span className={styles.text}>所有人可访问</span>
        <Form.Item name={['config', 'openVisit']} noStyle valuePropName="checked">
          <Switch />
        </Form.Item>
      </label>

      <Form.Item label="流程访问权限设置" name="visits">
        <MemberSelector projectId={subapp.data?.app.project.id} />
      </Form.Item>

      <Form.Item label="消息设置">
        <Form.Item help="当节点有新的待办事项时（包含转交），对该节点的节点负责人进行提醒">
          <label className={styles['horizontal-item']}>
            <span className={styles.text}>待办消息</span>
            <Form.Item valuePropName="checked" name={['config', 'meta', 'messageConfig', 'enableTodo']} noStyle>
              <Switch />
            </Form.Item>
          </label>
        </Form.Item>

        <Form.Item help="流程结束后，对申请发起人进行申请结果通知，包含：已通过、已拒绝">
          <label className={styles['horizontal-item']}>
            <span className={styles.text}>办结消息</span>
            <Form.Item valuePropName="checked" name={['config', 'meta', 'messageConfig', 'enableDone']} noStyle>
              <Switch />
            </Form.Item>
          </label>
        </Form.Item>
      </Form.Item>

      <Form.Item
        label="提示方式"
        name={['config', 'meta', 'messageConfig', 'noticeChannels']}
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
