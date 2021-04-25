import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Dropdown, Menu, Button, Drawer } from 'antd';
import classnames from 'classnames';
import { axios } from '@utils';
import { MAIN_CONTENT_CLASSNAME } from '@consts';
import Icon from '@components/icon';
// import Loading from '@components/loading';
import ApiList from './apis-list';
import ApiCard, { ApiShape } from './apis-list/card';
import { SceneShape as SceneBaseType } from '../home/types';
import styles from './index.module.scss';

interface SceneShape extends SceneBaseType {
  project: {
    id: number;
  };
}

interface GridCloumnProps {
  icon: string;
  title: string;
  children?: React.ReactNode;
  type: 'page' | 'data' | 'api';
  onAdd(type: GridCloumnProps['type']): void;
}
function GridColumn(props: GridCloumnProps) {
  const { icon, title, children, type, onAdd } = props;

  const handleAdd = useCallback(() => {
    onAdd(type);
  }, [onAdd, type]);

  const isEmpty = useMemo(() => {
    if (!children) {
      return true;
    }

    if (Array.isArray(children)) {
      return children.length === 0;
    }

    return false;
  }, [children]);

  const addApisNode = useMemo(() => {
    return (
      <div className={styles.add} onClick={handleAdd}>
        <Icon type="xinzengjiacu" className={styles['add-icon']} />
        <div>新增</div>
      </div>
    );
  }, [handleAdd]);

  return (
    <div className={styles.column}>
      <div className={styles['column-header']}>
        <div className={styles.title}>
          <Icon className={styles['column-icon']} type={icon} />
          <div className={styles.text}>{title}</div>
        </div>
        {isEmpty || addApisNode}
      </div>
      <div className={classnames(styles['column-content'], { [styles['column-empty']]: isEmpty })}>
        {isEmpty && addApisNode}
      </div>
    </div>
  );
}

export default function SceneDetail() {
  const { sceneId } = useParams<{ sceneId: string }>();
  const history = useHistory();
  const [currentScene, setCurrentScene] = useState<SceneShape>();
  const [sceneMenusItems, setSceneMenusItems] = useState<SceneBaseType[]>([]);
  const [showAddApiDrawer, setShowAddApiDrawer] = useState(false);
  const [addApiIds, setAddApiIds] = useState<number[]>([]);
  const [sceneApis, setSceneApis] = useState<ApiShape[]>([]);

  useEffect(() => {
    axios.get<SceneShape>(`/scene/${sceneId}`).then(({ data }) => {
      setCurrentScene(data);

      axios.get<SceneBaseType[]>(`scene/${data.project.id}/list/all`).then(({ data }) => {
        setSceneMenusItems(data);
      });
    });
  }, [sceneId]);

  const handleLinkToDetail = useCallback(
    (id: number) => {
      history.replace(`/scenes/${id}`);
    },
    [history],
  );

  const dropdownOptions = useMemo(() => {
    return (
      <Menu className={styles.scenes}>
        {sceneMenusItems.map((item) => {
          return (
            <Menu.Item
              className={classnames(styles.scene, { [styles.active]: Number(sceneId) === item.id })}
              key={item.id}
              onClick={() => handleLinkToDetail(item.id)}
            >
              {item.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }, [sceneMenusItems, sceneId]);

  const handleAddPage = useCallback(() => {}, []);
  const handleAddData = useCallback(() => {}, []);
  const handleAddApi = useCallback(() => {
    setShowAddApiDrawer(true);
  }, []);

  const handleCloseApiDrawer = useCallback(() => {
    setAddApiIds([]);
    setShowAddApiDrawer(false);
  }, []);

  const handleAddApiChange = useCallback((ids: number[]) => {
    setAddApiIds(ids);
  }, []);

  const handleAddApiSubmit = useCallback(() => {
    console.log(addApiIds);
  }, [addApiIds]);

  const addApiDrawerFooter = useMemo(() => {
    return (
      <div className={styles.buttons}>
        <div className={styles.group}>
          <Button type="default" icon={<Icon type="zhucexinjiekou" className={styles['button-icon']} />} size="large">
            注册新接口
          </Button>
          <Button icon={<Icon type="bianpai" className={styles['button-icon']} />} size="large">
            编排新接口
          </Button>
        </div>
        <Button type="primary" size="large" icon={<Icon type="bianpai" />} onClick={handleAddApiSubmit}>
          确定
        </Button>
      </div>
    );
  }, [handleAddApiSubmit]);

  return (
    <div className={classnames(MAIN_CONTENT_CLASSNAME, styles.detail)}>
      <div className={styles.header}>
        <div className={styles.tool}>
          <Icon className={classnames(styles.icon, styles.back)} type="fanhui" onClick={history.goBack} />
          <Dropdown overlay={dropdownOptions}>
            <div className={styles.dropdown}>
              <div className={styles.name}>{currentScene?.name}</div>
              <Icon className={classnames(styles.icon, styles.arrow)} type="xiasanjiao"></Icon>
            </div>
          </Dropdown>
        </div>

        <Button type="primary" size="large">
          发布
        </Button>
      </div>
      <div className={styles.content}>
        <GridColumn icon="yemianbianpai" title="页面编排" type="page" onAdd={handleAddPage}></GridColumn>
        <GridColumn icon="shujubianpai" title="数据编排" type="data" onAdd={handleAddData}></GridColumn>
        <GridColumn icon="api" title="API编排" type="api" onAdd={handleAddApi}>
          {sceneApis.map((api) => (
            <ApiCard data={api} />
          ))}
        </GridColumn>
      </div>
      <Drawer
        title="新增API编排"
        placement="right"
        visible={showAddApiDrawer}
        onClose={handleCloseApiDrawer}
        destroyOnClose
        width={440}
        footer={addApiDrawerFooter}
        bodyStyle={{ padding: 0 }}
      >
        <ApiList value={addApiIds} onChange={handleAddApiChange} />
      </Drawer>
    </div>
  );
}
