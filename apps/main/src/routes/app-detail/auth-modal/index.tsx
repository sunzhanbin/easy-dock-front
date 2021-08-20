import { memo, FC, useMemo, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { SubAppTypeEnum, SubAppPower } from '@/schema/app';
import { fetchSubAppPowers } from '@/api/auth';
import styles from './index.module.scss';

const AuthModal: FC<{ appName: string; appId: string; onClose: () => void; onOk: () => void }> = ({
  appId,
  appName,
  onClose,
  onOk,
}) => {
  const [subAppList, setSubAppList] = useState<SubAppPower[]>([]);
  const fetchAppList = useMemoCallback(() => {
    fetchSubAppPowers(appId).then((res) => {
      setSubAppList(res.data.subappPowers);
    });
  });
  const flowSubAppList = useMemo(() => {
    return subAppList.filter((subApp) => subApp.type === SubAppTypeEnum.FLOW) || [];
  }, [subAppList]);
  const screenSubAppList = useMemo(() => {
    return subAppList.filter((subApp) => subApp.type === SubAppTypeEnum.SCREEN) || [];
  }, [subAppList]);
  useEffect(() => {
    fetchAppList();
  }, []);
  return (
    <Modal
      className={styles['auth-modal']}
      title={`${appName}应用端访问权限`}
      closeIcon={<Icon type="guanbi" className={styles.close} />}
      visible={true}
      centered={true}
      width={600}
      onCancel={onClose}
      onOk={onOk}
    >
      <div className={styles.content}>
        <div className={styles.tip}>
          <div className={styles.icon}>
            <Icon type="shuomingwukuang" />
          </div>
          <div className={styles.text}>子应用设置成员或角色后，成员或角色会在应用端看到该菜单</div>
        </div>
        <div className={styles['flow-auth']}>
          <div className={styles.title}>流程</div>
          <div className={styles['app-list']}>
            <div className={styles.app}>
              <div className={styles.title}>
                <div className={styles.name}>流程数据管理</div>
                <div className={styles.add}>
                  <Icon type="xinzeng" className={styles.icon} />
                </div>
              </div>
            </div>
            {flowSubAppList.map((subApp) => {
              return (
                <div className={styles.app} key={subApp.id}>
                  <div className={styles.title}>
                    <div className={styles.name}>{subApp.name}</div>
                    <div className={styles.add}>
                      <Icon type="xinzeng" className={styles.icon} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {screenSubAppList.length > 0 && (
          <div className={styles['page-auth']}>
            <div className={styles.title}>页面</div>
            {screenSubAppList.map((subApp) => {
              return (
                <div className={styles.app} key={subApp.id}>
                  <div className={styles.title}>
                    <div className={styles.name}>{subApp.name}</div>
                    <div className={styles.add}>
                      <Icon type="xinzeng" className={styles.icon} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default memo(AuthModal);
