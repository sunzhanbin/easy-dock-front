import { memo, FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import styles from './index.module.scss';
import { axios } from '@/utils';
import { SceneShape, SubAppInfo } from '../scenes/types';
import Empty from './empty/index';
import { Text, Icon, Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Button, Input } from 'antd';
import Card from './subapp-card';
import AppModel from './app-model';
import AuthModal from './auth-modal';
import { AppInfo } from '@/schema/app';
import { AppAuthParams, assignAppAuth } from '@/api/auth';
import { FlowMicroApp, MAIN_CONTENT_CLASSNAME } from '@/consts';

const AppDetail: FC = () => {
  const history = useHistory();
  const { appId } = useParams<{ appId: string }>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [appInfo, setAppInfo] = useState<SceneShape>();
  const [subAppList, setSubAppList] = useState<SubAppInfo[]>([]);
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [keyWord, setKeyWord] = useState<string>('');
  const filterAppList = useMemo(() => {
    if (keyWord) {
      return subAppList.filter(({ name }) => name.indexOf(keyWord) > -1);
    }
    return subAppList;
  }, [subAppList, keyWord]);
  const handleSearch = useCallback((e) => {
    setKeyWord(e.target.value);
  }, []);
  const handleOK = useCallback(
    (name, type) => {
      axios.post('/subapp', { appId, name, type }).then((res) => {
        setShowAppModal(false);
        history.push(`${FlowMicroApp.route}/bpm-editor/${res.data.id}/form-design`);
      });
    },
    [appId, history],
  );
  // const handleAssignAppAuth = useMemoCallback((value: AppAuthParams) => {
  //   assignAppAuth(value).finally(() => {
  //     setShowAuthModal(false);
  //   });
  // });
  const handleCrateSubApp = useCallback(() => {
    setShowAppModal(true);
  }, []);
  const handleShowAuthModal = useMemoCallback(() => {
    setShowAuthModal(true);
  });
  const handleChange = useCallback(() => {
    axios.get(`/subapp/${appId}/list/all`).then((res) => {
      setSubAppList(res.data);
    });
  }, [appId]);
  const handleKeyUp = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        handleSearch(e);
      }
    },
    [handleSearch],
  );
  useEffect(() => {
    const appPromise = axios.get(`/app/${appId}`);
    const subAppListPromise = axios.get(`/subapp/${appId}/list/all`);
    Promise.all([appPromise, subAppListPromise])
      .then((res) => {
        const [{ data: appInfo }, { data: subAppList }] = res;
        setAppInfo(appInfo);
        setSubAppList(subAppList);
      })
      .finally(() => {
        setTimeout(() => {
          setLoaded(true);
        }, 200);
      });
  }, [appId, setLoaded]);
  return (
    <div>
      {loaded ? (
        <div className={classNames(styles.container, MAIN_CONTENT_CLASSNAME)}>
          <div className={styles.header}>
            <Icon
              className={styles.back}
              type="fanhui"
              onClick={() => {
                history.replace('/builder');
              }}
            />
            <div className={classNames(styles.status, appInfo?.status === 1 ? styles.active : styles.negative)}>
              {appInfo?.status === 1 ? '已启用' : '已停用'}
            </div>
            <div className={styles.app_info}>
              <div className={styles.name}>
                <Text text={appInfo?.name || ''} getContainer={false} />
              </div>
              {subAppList.length > 0 && (
                <>
                  <div className={styles.number}>({subAppList.length})</div>
                  <div className={styles.line}></div>
                  <div className={styles.auth} onClick={handleShowAuthModal}>
                    <Icon type="quanxianshezhi" className={styles.icon} />
                    <span className={styles.text}>应用端访问权限</span>
                  </div>
                </>
              )}
            </div>
            {subAppList.length > 0 && (
              <div className={styles.search_container}>
                <Input
                  className={styles.search}
                  prefix={<Icon type="sousuo" />}
                  size="large"
                  placeholder="搜索子应用名称"
                  onChange={handleSearch}
                  onKeyUp={handleKeyUp}
                />
              </div>
            )}
          </div>
          <div className={styles.content}>
            {subAppList.length > 0 ? (
              <div
                className={classNames(styles.scenes, { [styles['no-scene']]: subAppList.length === 0 })}
                id="sub_app_card_list"
              >
                <div className={classNames(styles.card, styles.scene)}>
                  <Button
                    className={styles.btn}
                    size="large"
                    type="primary"
                    shape="circle"
                    icon={<Icon type="xinzeng" />}
                    onClick={handleCrateSubApp}
                  />
                  <div>新建子应用</div>
                  {showAppModal && (
                    <AppModel
                      type="create"
                      position="left"
                      className={styles.createModel}
                      onClose={() => {
                        setShowAppModal(false);
                      }}
                      onOk={handleOK}
                    />
                  )}
                </div>
                {filterAppList.map(({ id, name, status, type, version }) => (
                  <Card
                    name={name}
                    id={id}
                    status={status}
                    type={type}
                    className={styles.card}
                    version={version}
                    key={name}
                    onChange={handleChange}
                    containerId="sub_app_card_list"
                  />
                ))}
              </div>
            ) : (
              <Empty appId={appId} />
            )}
          </div>
          {showAuthModal && (
            <AuthModal
              appInfo={(appInfo as unknown) as AppInfo}
              onClose={() => {
                setShowAuthModal(false);
              }}
              onOk={() => {
                setShowAuthModal(false);
              }}
            />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default memo(AppDetail);
