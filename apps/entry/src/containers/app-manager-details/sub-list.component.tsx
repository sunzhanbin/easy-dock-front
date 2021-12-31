import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import { Tabs, Input, Button, Switch, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import {
  useFetchSubAppListQuery,
  useWorkspaceDetailQuery,
  useCreateSupAppMutation,
  useModifyAppStatusMutation,
} from "@/http";
import { selectCurrentWorkspaceId } from "@views/app-manager/index.slice";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { SubAppInfo, SubAppType } from "@/consts";
import { Icon } from "@common/components";
import classnames from "classnames";
import AppPreviewModal from "@containers/app-preview-modal";
import { imgIdToUrl } from "@/utils/utils";
import AppModal from "./app-modal.component";
import AppCard from "./app-card.component";
import AppEmpty from "./app-empty.component";
import "@containers/app-manager-details/sub-list.style";

const { TabPane } = Tabs;

const SubListComponent: React.FC = () => {
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const { data: workspace } = useWorkspaceDetailQuery(workspaceId);
  const { data: subAppList } = useFetchSubAppListQuery(workspaceId);
  const [createSubApp] = useCreateSupAppMutation();
  const [modifyAppStatus] = useModifyAppStatusMutation();
  const navigate = useNavigate();
  const extension = useMemo(() => workspace?.extension, [workspace]);
  const subAppCount = useMemo(() => subAppList?.length || 0, [subAppList]);
  const theme = useMemo(() => extension?.theme || "light", [extension]);
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [initialSubAppList, setInitialSubAppList] = useState<SubAppInfo[]>([]);
  const [activeKey, setActiveKey] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // 动态获取阴影的高度,实现嵌入的阴影效果
  const style = useMemo<React.CSSProperties>(() => {
    const el = containerRef.current;
    if (!el) {
      return {};
    }
    const height = el.getBoundingClientRect().height;
    return {
      // boxShadow: `0px ${80 - height}px 24px 0px rgba(24, 31, 67, 0.08)`,
    };
  }, [containerRef.current]);

  const handleTabsChange = useCallback((activeKey: string) => {
    setShowAppModal(false);
    setActiveKey(activeKey);
  }, []);

  const handleCreateSubApp = useMemoCallback(() => {
    setShowAppModal(true);
  });

  const handleOk = useMemoCallback((name, type) => {
    createSubApp({ appId: workspaceId, name, type }).then(() => {
      message.success("子应用创建成功!");
    });
  });

  const handlePreview = useMemoCallback(() => {
    setShowModal(true);
  });

  const handleModalClose = useMemoCallback(() => {
    setShowModal(false);
  });

  const handleAppStatusChange = useMemoCallback(async (checked: boolean) => {
    const params = { id: workspaceId, status: checked ? 1 : -1 };
    try {
      await modifyAppStatus(params);
      message.success(checked ? "启用成功!" : "停用成功!");
    } catch (error) {
      console.error(error);
    }
  });

  const handleEdit = useMemoCallback(() => {
    navigate(`/app-manager/${workspaceId}`);
  });

  const handleJumpToClient = useMemoCallback(() => {
    window.open(`/workspace/${workspaceId}`);
  });

  const formAppList = useMemo(() => {
    const list = Array.isArray(initialSubAppList) ? [...initialSubAppList] : [];
    return list.filter(({ type }: SubAppInfo) => type === SubAppType.FORM);
  }, [initialSubAppList]);

  const flowAppList = useMemo(() => {
    const list = Array.isArray(initialSubAppList) ? [...initialSubAppList] : [];
    return list.filter(({ type }: SubAppInfo) => type === SubAppType.FLOW);
  }, [initialSubAppList]);

  const chartAppList = useMemo(() => {
    const list = Array.isArray(initialSubAppList) ? [...initialSubAppList] : [];
    return list.filter(({ type }: SubAppInfo) => type === SubAppType.CHART);
  }, [initialSubAppList]);

  const canvasAppList = useMemo(() => {
    const list = Array.isArray(initialSubAppList) ? [...initialSubAppList] : [];
    return list.filter(({ type }: SubAppInfo) => type === SubAppType.CANVAS);
  }, [initialSubAppList]);

  const spaceAppList = useMemo(() => {
    const list = Array.isArray(initialSubAppList) ? [...initialSubAppList] : [];
    return list.filter(({ type }: SubAppInfo) => type === SubAppType.SPACE);
  }, [initialSubAppList]);

  const renderExtra = useMemo(() => {
    return (
      <Input
        allowClear
        size="large"
        placeholder="搜索子应用名称"
        prefix={<Icon type="sousuo" className="search-icon" />}
        onChange={(e) => setKeyword(e.target.value)}
      />
    );
  }, []);

  useEffect(() => {
    if (subAppList?.length > 0) {
      setInitialSubAppList(() => {
        return subAppList.filter((v: SubAppInfo) => v.name.includes(keyword));
      });
    }
  }, [subAppList, keyword]);

  useEffect(() => {
    (async () => {
      if (extension?.icon) {
        const url = await imgIdToUrl(extension.icon);
        setLogoUrl(url);
      }
    })();
  }, [extension]);

  return (
    <div
      className="sub-list-component-container"
      ref={containerRef}
      style={style}
    >
      {extension && (
        <div className="app-info">
          <div className="logo">
            <img src={logoUrl} alt="logo" />
          </div>
          <div className="content">
            <div className="header">
              <div className="left">
                <div className="app">应用</div>
                <div className="name">{extension.name}</div>
              </div>
              <div className="right">
                <div className="preview" onClick={handlePreview}>
                  <Icon type="yulan" className="icon" />
                  <div className="text">预览</div>
                </div>
                <div className="edit" onClick={handleEdit}>
                  <Icon type="bianji" className="icon" />
                  <div className="text">编辑</div>
                </div>
                <div className="edit" onClick={handleJumpToClient}>
                  <Icon type="yingyonduandinglan" className="icon" />
                  <div className="text">跳转应用端</div>
                </div>
                <Switch
                  className="switch"
                  checkedChildren="启用"
                  unCheckedChildren="停用"
                  defaultChecked={workspace?.status === 1}
                  onChange={handleAppStatusChange}
                />
              </div>
            </div>
            <div className="remark">{extension.remark || "这是一个应用"}</div>
          </div>
        </div>
      )}
      {subAppCount > 0 ? (
        <Tabs
          className={classnames(!extension ? "sub-app-tab" : "")}
          activeKey={activeKey}
          onChange={handleTabsChange}
          tabBarExtraContent={renderExtra}
        >
          <TabPane tab="全部" key="all">
            <div className="card-list">
              <div className="card">
                <Button
                  className="btn"
                  size="middle"
                  type="primary"
                  shape="circle"
                  icon={<Icon type="xinzeng" />}
                  onClick={handleCreateSubApp}
                />
                <div>新建子应用</div>
                {showAppModal && (
                  <AppModal
                    mode="create"
                    onClose={() => setShowAppModal(false)}
                    onOk={(name, type) => handleOk(name, type)}
                  />
                )}
              </div>
              {initialSubAppList.map((subApp: SubAppInfo) => (
                <AppCard subApp={subApp} key={subApp.id} />
              ))}
            </div>
          </TabPane>
          <TabPane tab="表单" key="form">
            <div className="card-list">
              <div className="card">
                <Button
                  className="btn"
                  size="middle"
                  type="primary"
                  shape="circle"
                  icon={<Icon type="xinzeng" />}
                  onClick={handleCreateSubApp}
                />
                <div>新建表单</div>
                {showAppModal && (
                  <AppModal
                    mode="create"
                    type={SubAppType.FORM}
                    onClose={() => setShowAppModal(false)}
                    onOk={(name, type) => handleOk(name, type)}
                  />
                )}
              </div>
              {formAppList.map((subApp: SubAppInfo) => (
                <AppCard subApp={subApp} key={subApp.id} />
              ))}
            </div>
          </TabPane>
          <TabPane tab="流程" key="flow">
            <div className="card-list">
              <div className="card">
                <Button
                  className="btn"
                  size="middle"
                  type="primary"
                  shape="circle"
                  icon={<Icon type="xinzeng" />}
                  onClick={handleCreateSubApp}
                />
                <div>新建流程</div>
                {showAppModal && (
                  <AppModal
                    mode="create"
                    type={SubAppType.FLOW}
                    onClose={() => setShowAppModal(false)}
                    onOk={(name, type) => handleOk(name, type)}
                  />
                )}
              </div>
              {flowAppList.map((subApp: SubAppInfo) => (
                <AppCard subApp={subApp} key={subApp.id} />
              ))}
            </div>
          </TabPane>
          <TabPane tab="报表" key="chart">
            <div className="card-list">
              <div className="card">
                <Button
                  className="btn"
                  size="middle"
                  type="primary"
                  shape="circle"
                  icon={<Icon type="xinzeng" />}
                  onClick={handleCreateSubApp}
                />
                <div>新建报表</div>
                {showAppModal && (
                  <AppModal
                    mode="create"
                    type={SubAppType.CHART}
                    onClose={() => setShowAppModal(false)}
                    onOk={(name, type) => handleOk(name, type)}
                  />
                )}
              </div>
              {chartAppList.map((subApp: SubAppInfo) => (
                <AppCard subApp={subApp} key={subApp.id} />
              ))}
            </div>
          </TabPane>
          <TabPane tab="大屏" key="canvas">
            <div className="card-list">
              <div className="card">
                <Button
                  className="btn"
                  size="middle"
                  type="primary"
                  shape="circle"
                  icon={<Icon type="xinzeng" />}
                  onClick={handleCreateSubApp}
                />
                <div>新建大屏</div>
                {showAppModal && (
                  <AppModal
                    mode="create"
                    type={SubAppType.CANVAS}
                    onClose={() => setShowAppModal(false)}
                    onOk={(name, type) => handleOk(name, type)}
                  />
                )}
              </div>
              {canvasAppList.map((subApp: SubAppInfo) => (
                <AppCard subApp={subApp} key={subApp.id} />
              ))}
            </div>
          </TabPane>
          <TabPane tab="空间" key="space">
            <div className="card-list">
              <div className="card">
                <Button
                  className="btn"
                  size="middle"
                  type="primary"
                  shape="circle"
                  icon={<Icon type="xinzeng" />}
                  onClick={handleCreateSubApp}
                />
                <div>新建空间</div>
                {showAppModal && (
                  <AppModal
                    mode="create"
                    type={SubAppType.SPACE}
                    onClose={() => setShowAppModal(false)}
                    onOk={(name, type) => handleOk(name, type)}
                  />
                )}
              </div>
              {spaceAppList.map((subApp: SubAppInfo) => (
                <AppCard subApp={subApp} key={subApp.id} />
              ))}
            </div>
          </TabPane>
        </Tabs>
      ) : (
        <AppEmpty />
      )}
      <AppPreviewModal
        visible={showModal}
        theme={theme}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default SubListComponent;
