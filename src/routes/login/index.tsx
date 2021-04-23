import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

import { localStorage, axios } from '@utils';
import styles from './index.module.scss';

export default function Login() {
  const [form] = Form.useForm();
  const history = useHistory();
  const login = useCallback(
    async (values) => {
      const data = {
        loginType: 1,
        appCode: 'easydock',
        ...values,
      };

      const loginResponse = await axios.post('/api/auth/v1/login', data, {
        baseURL: process.env.REACT_APP_LOGIN_DOMAIN,
      });

      if (loginResponse.data) {
        localStorage('token', loginResponse.data.token);

        history.replace('/');
      }
    },
    [history],
  );

  return (
    <div className={styles.container}>
      <Form className={styles.form} layout="vertical" form={form} onFinish={login}>
        <Form.Item label="用户名" name="username" required>
          <Input placeholder="请输入用户名"></Input>
        </Form.Item>
        <Form.Item label="密码" name="password" required>
          <Input placeholder="请输入密码" type="password"></Input>
        </Form.Item>
        <Form.Item className={styles.footer}>
          <Button htmlType="submit" type="primary">
            登陆
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
