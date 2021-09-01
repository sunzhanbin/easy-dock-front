import { memo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Location } from 'history';
import { Form, Switch, Checkbox, Input } from 'antd';
import classnames from 'classnames';
import { MemberSelector, Loading, Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useSubAppDetail, loadExtend, SubAppState, setDirty, setExtend } from '@app/app';
import { TipType } from '@type/subapp';
import styles from './index.module.scss';

function SubAppExtend() {
  const [form] = Form.useForm<SubAppState['extend']>();
  const formRef = useRef<typeof form>(form);
  const dispatch = useDispatch();
  const subapp = useSubAppDetail();

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (subapp.data?.id) {
      dispatch(loadExtend(subapp.data.id))
        .then(unwrapResult)
        .then((data) => {
          formRef.current!.setFieldsValue(data);
        });
    }
  }, [subapp.data?.id, dispatch]);

  const handleExtendChange = useMemoCallback((_: any, values: SubAppState['extend']) => {
    dispatch(setDirty(true));
    dispatch(setExtend(values));
  });

  return (
    <Form form={form} className={styles.form} onValuesChange={handleExtendChange} colon={false}>
      {subapp.loading && <Loading />}

      <Form.Item
        className={styles['open-visit-setting']}
        name={['config', 'openVisit']}
        label="流程访问权限设置"
        valuePropName="checked"
      >
        <Checkbox>所有人可访问</Checkbox>
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const isOpenVisit = getFieldValue(['config', 'openVisit']);

          if (isOpenVisit) return null;

          return (
            <Form.Item name="visits">
              <MemberSelector projectId={subapp.data?.app.project.id} strictDept>
                <>
                  <Icon className={styles['visits-icon']} type="xinzeng" />
                  <span className={styles['visits-label']}>添加访问人</span>
                </>
              </MemberSelector>
            </Form.Item>
          );
        }}
      </Form.Item>

      <div className={styles.divider} />

      <h2 className={styles['message-setting__title']}>消息设置</h2>

      <Form.Item
        className={styles['message-form-item']}
        label="待办消息"
        valuePropName="checked"
        name={['config', 'meta', 'messageConfig', 'enableTodo']}
      >
        <Switch />
      </Form.Item>

      <p className={styles.help}>当节点有新的待办事项时（包含转交），对该节点的节点负责人进行提醒</p>

      <Form.Item
        className={styles['message-form-item']}
        label="办结消息"
        valuePropName="checked"
        name={['config', 'meta', 'messageConfig', 'enableDone']}
      >
        <Switch />
      </Form.Item>

      <p className={styles.help}>流程结束后，对申请发起人进行申请结果通知，包含：已通过、已拒绝</p>

      <Form.Item
        className={classnames(styles['message-form-item'], styles['tip-format'])}
        label="提示方式"
        name={['config', 'meta', 'messageConfig', 'noticeChannels']}
      >
        <Checkbox.Group>
          <Checkbox value={TipType.WeiChat}>微信提示</Checkbox>
          <Checkbox value={TipType.SMS}>短信提示</Checkbox>
          <Checkbox value={TipType.Email}>邮件提示</Checkbox>
          <Checkbox value={TipType.Phone}>语音电话提示</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <p className={styles.help}>仅对上述的提醒类型生效，自定义提醒的提醒方式需要单独设置</p>

      <Form.Item
        className={styles['webhook-config']}
        label="webhook设置"
        name={['config', 'meta', 'webhookConfig', 'enable']}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const showUrl = getFieldValue(['config', 'meta', 'webhookConfig', 'enable']);
          if (!showUrl) return null;

          return (
            <Form.Item className={styles.webhook} name={['config', 'meta', 'webhookConfig', 'url']}>
              <Input size="large" placeholder="请输入接口地址" />
            </Form.Item>
          );
        }}
      </Form.Item>

      <ol className={styles['webhook-help']}>
        <li className={styles['webhook-help__item']}>
          1.通过配置Webhook，平台支持在流程流转过程中将流程状态及相关业务数据下发到第三方系统
        </li>
        <li className={styles['webhook-help__item']}>
          2.使用者通过配置接收地址即可接收来自零达下发的流程数据及填报的业务数据（POST请求），从而方便第三方系统的业务处理。
        </li>
      </ol>
    </Form>
  );
}

export default memo(SubAppExtend, (prevProps: { location: Location }, nextProps: { location: Location }) => {
  return prevProps.location.pathname !== nextProps.location.pathname;
});
