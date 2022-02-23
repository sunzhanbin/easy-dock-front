import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Dropdown, Menu, Button, Drawer, message, Modal, Form, Input } from "antd";
import classnames from "classnames";
import { axios } from "@utils";
import { MAIN_CONTENT_CLASSNAME, ROUTES, dynamicRoutes } from "@consts";
import Icon from "@components/icon";
import Loading from "@components/loading";
import ApiList from "./apis-list";
import ApiCard, { ApiShape } from "./apis-list/api";
import { SceneShape as SceneBaseType } from "../scenes/types";
import styles from "./index.module.scss";

interface SceneShape extends SceneBaseType {
  project: {
    id: number;
  };
}

interface GridCloumnProps {
  icon: string;
  title: string;
  children?: React.ReactNode;
  type: "page" | "data" | "api";
  onAdd(type: GridCloumnProps["type"]): void;
  loading?: boolean;
  className?: string;
}

function GridColumn(props: GridCloumnProps) {
  const { icon, title, children, type, onAdd, loading, className } = props;

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
        <Icon type="xinzengjiacu" className={styles["add-icon"]} />
        <div>新增</div>
      </div>
    );
  }, [handleAdd]);

  return (
    <div className={classnames(styles.column, className)}>
      <div className={styles["column-components"]}>
        <div className={styles.title}>
          <Icon className={styles["column-icon"]} type={icon} />
          <div className={styles.text}>{title}</div>
        </div>
        {isEmpty || addApisNode}
      </div>
      <div className={classnames(styles["column-content"], { [styles["column-empty"]]: isEmpty })}>
        {(isEmpty && addApisNode) || children}
        {loading && <Loading />}
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
  const [checkApis, setCheckApis] = useState<ApiShape[]>([]);
  const [sceneApis, setSceneApis] = useState<ApiShape[]>([]);
  const [apisSubmiting, setApisSubmiting] = useState(false);
  const [fetchingSceneApis, setFetchingSceneApis] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    axios.get<{ data: SceneShape }>(`/app/${sceneId}`).then(({ data }) => {
      setCurrentScene(data);

      // 获取项目所有应用
      axios.get<{ data: SceneBaseType[] }>(`/app/${data.project.id}/list/all`).then(({ data }) => {
        setSceneMenusItems(data);
      });
    });

    setFetchingSceneApis(true);

    axios
      .get(`/meta_api/scene/${sceneId}/list/all`)
      .then(({ data }) => {
        setSceneApis(data);
      })
      .finally(() => {
        setFetchingSceneApis(false);
      });
  }, [sceneId]);

  const handleSwitchScene = useCallback(
    (id: number) => {
      if (id !== Number(sceneId)) {
        history.replace(dynamicRoutes.toSceneDetail(String(id)));
      }
    },
    [history, sceneId],
  );

  const dropdownOptions = useMemo(() => {
    return (
      <Menu className={styles.scenes}>
        {sceneMenusItems.map((item) => {
          return (
            <Menu.Item
              className={classnames(styles.scene, { [styles.active]: Number(sceneId) === item.id })}
              key={item.id}
              onClick={() => handleSwitchScene(item.id)}
            >
              {item.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }, [sceneMenusItems, sceneId, handleSwitchScene]);

  const handleAddPage = useCallback(() => {}, []);
  const handleAddData = useCallback(() => {}, []);
  const handleAddApi = useCallback(() => {
    setShowAddApiDrawer(true);
    setCheckApis([...sceneApis]);
  }, [sceneApis]);

  const handleCloseApiDrawer = useCallback(() => {
    setCheckApis([]);
    setShowAddApiDrawer(false);
  }, []);

  const handleAddApiChange = useCallback((apis: ApiShape[]) => {
    setCheckApis(apis);
  }, []);

  const handleAddApiSubmit = useCallback(async () => {
    setApisSubmiting(true);

    try {
      await axios.post("/meta_api/batch", {
        sceneId,
        apiList: checkApis,
      });

      message.success("添加成功");
      setShowAddApiDrawer(false);
      setSceneApis([...checkApis]);
    } finally {
      setApisSubmiting(false);
    }
  }, [checkApis, sceneId]);

  const handleLinkToRegistApi = useCallback(() => {
    history.push(ROUTES.INTEGRATION_ORCH_REGIST_API);
  }, [history]);

  const handleLinkToGenerationApi = useCallback(() => {
    history.push(ROUTES.INTEGRATION_ORCH_EDIT_GENERATION_API);
  }, [history]);

  const addApiDrawerFooter = useMemo(() => {
    return (
      <div className={styles.buttons}>
        <div className={styles.group}>
          <Button
            type="default"
            icon={<Icon type="zhucexinjiekou" className={styles["button-icon"]} />}
            size="large"
            onClick={handleLinkToRegistApi}
          >
            注册新接口
          </Button>
          <Button
            icon={<Icon type="bianpai" className={styles["button-icon"]} />}
            size="large"
            onClick={handleLinkToGenerationApi}
          >
            编排新接口
          </Button>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Icon type="bianpai" />}
          onClick={handleAddApiSubmit}
          loading={apisSubmiting}
        >
          确定
        </Button>
      </div>
    );
  }, [handleAddApiSubmit, apisSubmiting, handleLinkToRegistApi, handleLinkToGenerationApi]);

  const handleDeleteApi = useCallback(
    async (api: ApiShape) => {
      await axios.delete("/meta_api", { data: { metaId: api.id, sceneId } });

      message.success("删除成功");
      setSceneApis((apis) => apis.filter((item) => item.id !== api.id));
    },
    [sceneId],
  );

  const handleDeploy = useCallback(async () => {
    setDeploying(true);

    try {
      await axios.post("/scene/deploy", { sceneId, remark: form.getFieldValue("remark") });

      message.success("发布成功");
      setShowDeployModal(false);
    } finally {
      setDeploying(false);
    }
  }, [sceneId, form]);

  const handleShowDeployModal = useCallback(() => {
    setShowDeployModal(true);
  }, []);

  const handleCancelDeploy = useCallback(() => {
    setShowDeployModal(false);
  }, []);

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

        <Button type="primary" size="large" onClick={handleShowDeployModal}>
          发布
        </Button>
      </div>
      <div className={styles.content}>
        <GridColumn icon="yemianbianpai" title="页面编排" type="page" onAdd={handleAddPage}></GridColumn>
        <GridColumn icon="shujubianpai" title="数据编排" type="data" onAdd={handleAddData}></GridColumn>
        <GridColumn
          icon="api"
          title="API编排"
          type="api"
          onAdd={handleAddApi}
          loading={fetchingSceneApis}
          className={styles.apis}
        >
          {sceneApis.map((api) => (
            <ApiCard className={styles.api} data={api} key={api.id} onDelete={handleDeleteApi} />
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
        <ApiList value={checkApis} onChange={handleAddApiChange} />
      </Drawer>
      <Modal
        title="应用发布"
        onOk={handleDeploy}
        destroyOnClose
        keyboard={false}
        onCancel={handleCancelDeploy}
        confirmLoading={deploying}
        visible={showDeployModal}
        width={352}
        okButtonProps={{ size: "large" }}
        cancelButtonProps={{ size: "large", type: "text" }}
      >
        <Form form={form} layout="vertical" className={styles.form}>
          <Form.Item label="发布说明" name="remark">
            <Input.TextArea placeholder="请输入" maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
