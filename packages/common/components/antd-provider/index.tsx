import { memo, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';

function AntdProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider locale={zh_CN}>{children}</ConfigProvider>;
}

export default memo(AntdProvider);
