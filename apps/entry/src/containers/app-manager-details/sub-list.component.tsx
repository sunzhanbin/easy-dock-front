import React, { useCallback, useMemo, useState, useRef } from "react";
import { Tabs, Input, Button } from "antd";
import classNames from "classnames";
import { useAppSelector } from "@/store";
import { useFetchsubAppListQuery, useWorkspaceDetailQuery } from "@/http";
import { selectCurrentWorkspaceId } from "@views/app-manager/index.slice";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Icon } from "@common/components";
import AppModal from "./app-modal.component";
import "@containers/app-manager-details/sub-list.style";

const { TabPane } = Tabs;

const SubListComponent: React.FC = () => {
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const { data: subApps } = useFetchsubAppListQuery(workspaceId);
  const { data: workspace } = useWorkspaceDetailQuery(workspaceId);
  const { data: subAppList } = useFetchsubAppListQuery(workspaceId);
  const hasPublished = useMemo(() => workspace?.extension, [workspace]);
  const subAppCount = useMemo(() => subAppList?.length || 0, [subAppList]);
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
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
    setActiveKey(activeKey);
  }, []);

  const handleTabSearch = useCallback((value, event) => {
    event.preventDefault();
    console.log("value", handleTabSearch);
  }, []);

  const handleSearch = useMemoCallback(() => {
    console.info("search");
  });
  const handleCreateSubApp = useMemoCallback(() => {
    setShowAppModal(true);
  });

  const handleOk = useMemoCallback(() => {
    console.info("ok");
  });

  const renderExtra = useMemo(() => {
    return (
      <Input
        size="large"
        placeholder="搜索子应用名称"
        prefix={
          <Icon type="sousuo" className="search-icon" onClick={handleSearch} />
        }
      />
    );
  }, [handleSearch]);

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
                    onClose={() => {
                      setShowAppModal(false);
                    }}
                    onOk={handleOk}
                  />
                )}
              </div>
            </div>
          </TabPane>
          <TabPane tab="表单" key="form">
            form
          </TabPane>
          <TabPane tab="流程" key="flow">
            flow
          </TabPane>
          <TabPane tab="报表" key="chart">
            chart
          </TabPane>
          <TabPane tab="大屏" key="canvas">
            canvas
          </TabPane>
          <TabPane tab="空间" key="space">
            space
          </TabPane>
        </Tabs>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SubListComponent;
