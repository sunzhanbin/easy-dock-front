import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import cookie from 'js-cookie';
import loginIcon from '@assets/login-icon.png';
import logoIcon from '@assets/logo-icon.png';
import { runtimeAxios } from '@utils';
import { ROUTES } from '@consts';
import { Loading } from '@components';
import styles from './index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';

export default function Login() {
  const [form] = Form.useForm();
  const { search } = useLocation();
  const [loading, setLoading] = useState(false);
  const login = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const values = await form.validateFields();
      const loginResponse = await runtimeAxios.post<{ data: { token: string } }>('/auth/login', values);
      const token = loginResponse.data.token;
      let redirectUrl = '';

      // 记录token
      cookie.set('token', token, { expires: 1 });

      const keyValues = decodeURIComponent(search.slice(1)).split('=');
      const redirectUrlIndex = keyValues.findIndex((item) => item === 'redirect');

      if (redirectUrlIndex !== -1) {
        redirectUrl = keyValues[redirectUrlIndex + 1];
      } else {
        redirectUrl = ROUTES.INDEX;
      }

      window.location.replace(redirectUrl);
    } finally {
      setLoading(false);
    }
  }, [form, search, loading]);

  const validateRule = useMemoCallback((value: string, errorTip: string) => {
    if (!value) {
      return Promise.reject(new Error(errorTip));
    }
    return Promise.resolve();
  });

  const nameRules = useMemo(() => {
    return [
      {
        required: true,
        validator(_: any, value: string) {
          return validateRule(value, '用户名必填');
        },
      },
    ];
  }, []);

  const passwordRules = useMemo(() => {
    return [
      {
        required: true,
        validator(_: any, value: string) {
          return validateRule(value, '用户密码必填');
        },
      },
    ];
  }, []);

  const handleKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.code === 'Enter') {
        login();
      }
    },
    [login],
  );

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
          <Form.Item name="loginName" required rules={nameRules}>
            <Input placeholder="请输入用户名" prefix={<UserOutlined />} size="large" />
          </Form.Item>
          <Form.Item name="password" rules={passwordRules}>
            <Input
              placeholder="请输入密码"
              type="password"
              prefix={<KeyOutlined />}
              size="large"
              onKeyDown={handleKeydown}
            />
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
