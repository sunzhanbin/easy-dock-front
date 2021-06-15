import { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import cookie from 'js-cookie';
import loginIcon from '@assets/login-icon.png';
import logoIcon from '@assets/logo-icon.png';
import { axios } from '@utils';
import { ROUTES, envs } from '@consts';
import { Loading } from '@components';
import styles from './index.module.scss';

export default function Login() {
  const [form] = Form.useForm();
  const { search } = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const login = useCallback(async () => {
    if (loading) return;

    const values = await form.validateFields();
    const data = Object.assign({}, { loginType: 1, appCode: 'easydock' }, values);
    const loginResponse = await axios.post('/api/auth/v1/login', data, {
      baseURL: envs.COMMON_LOGIN_DOMAIN,
    });

    if (loginResponse.data) {
      const token = loginResponse.data.token;

      cookie.set('token', token, { expires: 1 });
      axios.defaults.headers.auth = token;

      let redirectUrl = '';
      const keyValues = decodeURIComponent(search.slice(1)).split('=');
      const redirectUrlIndex = keyValues.findIndex((item) => item === 'redirect');

      if (redirectUrlIndex !== -1) {
        redirectUrl = keyValues[redirectUrlIndex + 1];
      } else {
        redirectUrl = ROUTES.INDEX;
      }

      window.location.replace(redirectUrl);
    } else {
      message.error((loginResponse as any).resultMessage);
    }
  }, [form, search]);

  const nameRules = useMemo(() => {
    return [
      {
        required: true,
        validator(_: any, value: string) {
          if (!value) {
            return Promise.reject(new Error('用户名必填'));
          }

          return Promise.resolve();
        },
      },
    ];
  }, []);

  const passwordRules = useMemo(() => {
    return [
      {
        required: true,
        validator(_: any, value: string) {
          if (!value) {
            return Promise.reject(new Error('用户密码必填'));
          }

          return Promise.resolve();
        },
      },
    ];
  }, []);

  return (
    <div className={styles.content}>
      <img className={styles.image} src={`${process.env.PUBLIC_URL}/images/login.png`} alt="login" />
      <div className={styles.footer}>
        <div className={styles.info}>
          <img className={styles.logo} src={logoIcon} alt="logo" />
          <div className={styles.welcome}>欢迎使用</div>
          <div className={styles.name}>低代码平台</div>
        </div>
        <Form className={styles.form} layout="vertical" form={form} autoComplete="off">
          <Form.Item name="username" required rules={nameRules}>
            <Input placeholder="请输入用户名" prefix={<UserOutlined />} size="large" />
          </Form.Item>
          <Form.Item name="password" rules={passwordRules}>
            <Input placeholder="请输入密码" type="password" prefix={<KeyOutlined />} size="large" />
          </Form.Item>
        </Form>
        <div className={styles['login-icon']}>
          <img src={loginIcon} alt="login" onClick={login} />
          {loading && <Loading />}
        </div>
      </div>
    </div>
  );
}
