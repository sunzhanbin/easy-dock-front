import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Spin, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import classnames from 'classnames';
import Popover from '@/components/popover';
import Icon from '@components/icon';
import Project from './project';
import Form from './project/form';
import emptyImage from '@assets/empty.png';
import { axios } from '@utils';
import { MAIN_CONTENT_CLASSNAME, dynamicRoutes } from '@consts';
import Scene, { SceneProps } from './scene';
import EditScene, { EditSceneProps } from './edit-scene';
import { ProjectShape, ActionStatus, SceneShape } from './types';
import styles from './index.module.scss';

export default function Home() {
  const history = useHistory();
  const [fetching, setFetching] = useState(false);
  const [projects, setProjects] = useState<ProjectShape[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number>();
  const [activeProjectStatus, setActiveProjectStatus] = useState<ActionStatus>();
  const [scenes, setScenes] = useState<SceneShape[]>([]);
  const [showEditSceneModal, setShowEditSceneModal] = useState(false);
  const [editingScene, setEditingScene] = useState<SceneShape>();
  const formRef = useRef<FormInstance<{ name: string }>>();
  const fetchProjectListRef = useRef<() => Promise<void>>(async () => {
    setFetching(true);
    setActiveProjectStatus(undefined);

    try {
      const { data } = await axios.get<ProjectShape[]>('/project/list/all');
      const list: ProjectShape[] = data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          sceneCount: item.sceneCount,
        };
      });

      setProjects(list);
      setActiveProjectId((prevActiveProjectIid) => {
        if (list.length && !list.find((proj) => proj.id === prevActiveProjectIid)) {
          return list[0].id;
        }

        return prevActiveProjectIid;
      });
    } finally {
      setFetching(false);
    }
  });

  // 获取场景列表
  const fetchSceneList = useCallback(
    (projectId: number) => {
      axios.get(`/scene/${projectId}/list/all`).then(({ data }) => {
        setActiveProjectId((prevActiveProjectIid) => {
          if (prevActiveProjectIid === activeProjectId) {
            setScenes(data);
          }

          return prevActiveProjectIid;
        });
      });
    },
    [activeProjectId],
  );

  useEffect(() => {
    if (activeProjectId) {
      setEditingScene(undefined);
      fetchSceneList(activeProjectId);
    }
  }, [activeProjectId, fetchSceneList]);

  useEffect(() => {
    fetchProjectListRef.current();
  }, []);

  // 新增或编辑
  const handleEditProjectSubmit = useCallback(async (values) => {
    if (values.id) {
      // 编辑项目
      await axios.put('/project', values);

      message.success('修改成功');
      fetchProjectListRef.current();
    } else {
      // 新增项目
      const { data } = await axios.post('/project', values);

      message.success('添加成功');

      setActiveProjectId(data.id);
      fetchProjectListRef.current();
    }
  }, []);

  const handleAddProjectSubmit = useCallback(async () => {
    if (formRef.current) {
      await handleEditProjectSubmit(await formRef.current.validateFields());
    }
  }, [handleEditProjectSubmit]);

  const handleDelete = useCallback(async (id: number) => {
    await axios.delete(`/project/${id}`);

    message.success('删除成功');
    fetchProjectListRef.current();
  }, []);

  const handleAddScene = useCallback(() => {
    setEditingScene(undefined);
    setShowEditSceneModal(true);
  }, []);

  const handleEditScene = useCallback((data: SceneShape) => {
    setEditingScene(data);
    setShowEditSceneModal(true);
  }, []);

  const handleCancelScene = useCallback(() => {
    setShowEditSceneModal(false);
  }, []);

  const handleSubmitScene: EditSceneProps['onSubmit'] = useCallback(
    async (data) => {
      if (data.id) {
        // 编辑
        await axios.put('/scene', Object.assign({}, data, { projectId: activeProjectId }));

        message.success('场景修改成功');
      } else {
        // 新增
        await axios.post('/scene', Object.assign({}, data, { projectId: activeProjectId }));

        message.success('场景创建成功');
      }

      setShowEditSceneModal(false);
      setEditingScene(undefined);
      fetchSceneList(activeProjectId!);
      fetchProjectListRef.current();
    },
    [activeProjectId, fetchSceneList],
  );

  const handleModifySceneStatus: SceneProps['onStatusChange'] = useCallback(async (status, id) => {
    await axios.put('/scene/status', { status, id });

    message.success('修改成功');

    setScenes((scenes) => {
      return scenes.map((scene) => {
        if (scene.id === id) {
          return { ...scene, status };
        }

        return scene;
      });
    });
  }, []);

  const handleLinkToSceceDetailPage = useCallback(
    (data: SceneShape) => {
      history.push(dynamicRoutes.toSceneDetail(String(data.id)));
    },
    [history],
  );

  const handledeleteScene = useCallback(async (data: SceneShape) => {
    await axios.delete(`/scene/${data.id}`);
    message.success('删除成功');

    setScenes((scenes) => {
      return scenes.filter((scene) => scene.id !== data.id);
    });
  }, []);

  return (
    <div className={classnames(styles.container, MAIN_CONTENT_CLASSNAME)}>
      {fetching && <Spin className={styles.loading} />}

      {projects.length === 0 ? (
        <div className={styles.empty}>
          <img src={emptyImage} alt="empty" />
          <div className={styles.desc}>暂无项目，来创建一个吧</div>
          <Popover content={<Form formRef={formRef} />} placement="top" title="新增项目" onOk={handleAddProjectSubmit}>
            <Button size="large" type="primary" icon={<Icon type="xinzengjiacu" />}>
              创建项目
            </Button>
          </Popover>
        </div>
      ) : (
        <div className={styles.header}>
          <div className={styles.projects}>
            {projects.map((project) => {
              return (
                <Project
                  key={project.id}
                  data={project}
                  isActive={activeProjectId === project.id}
                  onSelected={setActiveProjectId}
                  onUpdate={handleEditProjectSubmit}
                  status={activeProjectStatus}
                  onStatusChange={setActiveProjectStatus}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
          <div className={styles['actions-group']}>
            <div className={styles.mask}></div>
            <Popover
              placement="bottom"
              content={<Form formRef={formRef} />}
              title="新增项目"
              onOk={handleAddProjectSubmit}
            >
              <div className={styles.action}>
                <Icon type="xinzengjiacu" className={styles.icon} />
                <span>新增</span>
              </div>
            </Popover>
            <span className={styles.line}></span>
            <Link to="/integration/orch/interface-manage" className={styles.action}>
              <Icon type="jicheng" className={styles.icon} />
              <span>集成管理</span>
            </Link>
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className={styles.content}>
          <div className={classnames(styles.scenes, { [styles['no-scene']]: scenes.length === 0 })}>
            <div className={classnames(styles.card, styles.scene)}>
              <Button
                className={styles.btn}
                size="large"
                type="primary"
                shape="circle"
                icon={<Icon type="xinzeng" />}
                onClick={handleAddScene}
              />
              <div>添加场景</div>
            </div>
            {scenes.map((scene) => {
              return (
                <Scene
                  className={styles.scene}
                  key={scene.id}
                  data={scene}
                  onEdit={handleEditScene}
                  onStatusChange={handleModifySceneStatus}
                  onTapCard={handleLinkToSceceDetailPage}
                  onDelete={handledeleteScene}
                />
              );
            })}
          </div>
        </div>
      )}

      <EditScene
        data={editingScene}
        visible={showEditSceneModal}
        onSubmit={handleSubmitScene}
        onCancel={handleCancelScene}
      />
    </div>
  );
}
