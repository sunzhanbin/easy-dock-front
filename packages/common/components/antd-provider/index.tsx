import { memo, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import Empty from '../empty';
import zh_CN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={zh_CN} renderEmpty={Empty}>
      {children}
    </ConfigProvider>
  );
}

export default memo(AntdProvider);
