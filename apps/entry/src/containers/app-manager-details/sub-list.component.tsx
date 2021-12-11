import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import { Tabs, Input, Button, message } from "antd";
import { useAppSelector } from "@/store";
import {
  useFetchsubAppListQuery,
  useWorkspaceDetailQuery,
  useCreateSupAppMutation,
} from "@/http";
import { selectCurrentWorkspaceId } from "@views/app-manager/index.slice";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { SubAppInfo, SubAppType } from "@/consts";
import { Icon } from "@common/components";
import AppModal from "./app-modal.component";
import AppCard from "./app-card.component";
import AppEmpty from "./app-empty.component";
import "@containers/app-manager-details/sub-list.style";

const { TabPane } = Tabs;

const SubListComponent: React.FC = () => {
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const { data: workspace } = useWorkspaceDetailQuery(workspaceId);
  const { data: subAppList } = useFetchsubAppListQuery(workspaceId);
  const [createSubApp] = useCreateSupAppMutation();
  const hasPublished = useMemo(() => workspace?.extension, [workspace]);
  const subAppCount = useMemo(() => subAppList?.length || 0, [subAppList]);
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [initialSubAppList, setInitialSubAppList] = useState<SubAppInfo[]>([]);
  const [activeKey, setActiveKey] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  // 动态获取阴影的高度,实现嵌入的阴影效果
  const style = useMemo<React.CSSProperties>(() => {
    const el = containerRef.current;
    if (!el) {
      return {};
    }
    const height = el.getBoundingClientRect().height;
    return {
      boxShadow: `0px ${80 - height}px 24px 0px rgba(24, 31, 67, 0.08)`,
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

  return (
    <div
      className="sub-list-component-container"
      ref={containerRef}
      style={style}
    >
      {hasPublished && (
        <div className="app-info">
          <div className="left"></div>
          <div className="right"></div>
        </div>
      )}
      {subAppCount > 0 ? (
        <Tabs
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
    </div>
  );
};

export default SubListComponent;
