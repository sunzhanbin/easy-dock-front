import { memo, useState, useCallback, FC } from 'react';
import FlowImage from '@assets/flow-normal.png';
import ScreenImage from '@assets/screen-normal.png';
import { Icon } from '@/components';
import { Form, Input, Button } from 'antd';
import { axios } from '@/utils';
import { useHistory } from 'react-router-dom';
import { FlowMicroApp } from '@/consts';
import { SubAppTypeEnum } from '@/schema/app';
import styles from './index.module.scss';
import classNames from 'classnames';

const EmptyDetail: FC<{ appId: string }> = ({ appId }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [activeName, setActiveName] = useState<string>('');
  const handleClose = useCallback((e) => {
    e.stopPropagation();
    setCanEdit(false);
  }, []);
  const handleFinish = useCallback(() => {
    form.validateFields().then(({ subAppName }: { subAppName: string }) => {
      axios.post('/subapp', { appId, name: subAppName, type: SubAppTypeEnum.FLOW }).then((res) => {
        history.push(`${FlowMicroApp.route}/bpm-editor/${res.data.id}/form-design`);
      });
    });
  }, [form, appId, history]);
  return (
    <div className={styles.empty_app}>
      <div
        className={classNames(styles.flow_app, activeName === 'flow' ? styles.active : '')}
        onClick={() => {
          setActiveName('flow');
          setCanEdit(true);
        }}
      >
        {canEdit && (
          <div className={styles.close} onClick={handleClose}>
            <Icon className={styles.back} type="guanbi" />
          </div>
        )}
        <div className={styles.title}>新建流程子应用</div>
        <div className={styles.tip}>可配置表单、流程、列表</div>
        {canEdit ? (
          <Form form={form} layout="vertical" className={styles.form} onFinish={handleFinish}>
            <Form.Item
              label="子应用名称"
              name="subAppName"
              required
              rules={[
                { required: true, message: '请输入子应用名称' },
                {
                  pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,20}$/,
                  message: '子应用名称应为3-20位汉字、字母、数字或下划线',
                },
              ]}
            >
              <Input size="large" placeholder="请输入" autoFocus />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" className={styles.submit} htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <img className={styles.image} src={FlowImage} alt="新建流程子应用" />
        )}
      </div>
      {/* 功能暂时未开放,禁用 */}
      <div className={styles.screen_app}>
        <div className={styles.title}>新建大屏子应用</div>
        <div className={styles.tip}>用于配置可视化大屏及其所需的数据、接口</div>
        <img className={styles.image} src={ScreenImage} alt="新建流程子应用" />
      </div>
    </div>
  );
};

export default memo(EmptyDetail);
