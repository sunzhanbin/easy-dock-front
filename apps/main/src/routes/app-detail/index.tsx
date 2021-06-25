import { memo, FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import styles from './index.module.scss';
import { axios, getShorterText } from '@/utils';
import { SceneShape, SubAppInfo } from '../scenes/types';
import Empty from './empty/index';
import { Icon } from '@/components';
import { Button, Input } from 'antd';
import Card from './subapp-card';
import AppModel from './app-model';
import { FlowMicroApp, MAIN_CONTENT_CLASSNAME } from '@/consts';

const AppDetail: FC = () => {
  const history = useHistory();
  const { appId } = useParams<{ appId: string }>();
  const [appInfo, setAppInfo] = useState<SceneShape>();
  const [subAppList, setSubAppList] = useState<SubAppInfo[]>([]);
  const [isShowModel, setIsShowModel] = useState<boolean>(false);
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
        setIsShowModel(false);
        history.push(`${FlowMicroApp.route}/bpm-editor/${res.data.id}/form-design`);
      });
    },
    [appId, history],
  );
  const handleCrateSubApp = useCallback(() => {
    setIsShowModel(true);
  }, [setIsShowModel]);
  const handleChange = useCallback(() => {
    axios.get(`/subapp/${appId}/list/all`).then((res) => {
      setSubAppList(res.data);
    });
  }, [appId]);
  useEffect(() => {
    const appPromise = axios.get(`/app/${appId}`);
    const subAppListPromise = axios.get(`/subapp/${appId}/list/all`);
    Promise.all([appPromise, subAppListPromise]).then((res) => {
      const [{ data: appInfo }, { data: subAppList }] = res;
      setAppInfo(appInfo);
      setSubAppList(subAppList);
    });
  }, [appId]);
  return (
    <div className={classNames(styles.container, MAIN_CONTENT_CLASSNAME)}>
      <div className={styles.header}>
        <Icon className={styles.back} type="fanhui" onClick={history.goBack} />
        <div className={styles.app_name}>{appInfo?.name && getShorterText(appInfo.name)}</div>
        {subAppList.length > 0 && (
          <div className={styles.more_info}>
            <div className={styles.number}>({subAppList.length})</div>
            <div className={classNames(styles.status, appInfo?.status === 1 ? styles.active : styles.negative)}>
              {appInfo?.status === 1 ? '已启用' : '已停用'}
            </div>
          </div>
        )}
        <div className={styles.search_container}>
          <Input
            className={styles.search}
            prefix={<Icon type="sousuo" />}
            size="large"
            placeholder="搜索子应用名称"
            onBlur={handleSearch}
          />
        </div>
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
              {isShowModel && (
                <AppModel
                  type="create"
                  position="left"
                  className={styles.createModel}
                  onClose={() => {
                    setIsShowModel(false);
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
    </div>
  );
};

export default memo(AppDetail);
