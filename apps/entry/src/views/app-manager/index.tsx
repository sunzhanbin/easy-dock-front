import React, { useCallback, useRef } from "react";
import { Layout, Menu, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import AppManagerDetails from "@components/app-manager-details";
import AddWorkspaceModal from "@/components/add-workspace-modal";
import { useFetchWorkspaceListQuery } from "@/http";
import {
  selectCurrentWorkspaceId,
  setCurrentWorkspaceId,
  selectProjectId,
} from "./index.slice";

const { Sider, Content } = Layout;

const AppManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const projectId = useSelector(selectProjectId);
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const modalRef = useRef<any>();

  const { data: workspaceList } = useFetchWorkspaceListQuery(projectId);

  const handleAddWorkspaceVisible = useCallback(() => {
    modalRef.current.show();
  }, []);

  const handleMenuClick = useCallback(
    ({ key }) => {
      dispatch(setCurrentWorkspaceId(key));
    },
    [dispatch]
  );

  return (
    <Layout>
      <Sider trigger={null} collapsible>
        <div className="logo" />
        {workspaceId && (
          <>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[`${workspaceId}`]}
              onClick={handleMenuClick}
            >
              {workspaceList?.map((workspace: any) => (
                <Menu.Item key={workspace.id}>{workspace.name}</Menu.Item>
              ))}
            </Menu>
            <Button onClick={handleAddWorkspaceVisible}>新增工作区</Button>
          </>
        )}
      </Sider>
      <Layout className="site-layout">
        <Content className="site-layout-background">
          {workspaceId && <AppManagerDetails />}
        </Content>
      </Layout>
      <AddWorkspaceModal ref={modalRef} />
    </Layout>
  );
};

export default AppManager;
