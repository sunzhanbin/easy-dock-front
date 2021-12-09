import { useCallback, useRef, useMemo } from "react";
import { Layout, Menu, Button, Input } from "antd";
import { useFetchWorkspaceListQuery } from "@/http";
import { useAppDispatch, useAppSelector } from "@/store";
import AddWorkspaceModal from "@components/add-workspace-modal";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Icon } from "@common/components";
import {
  selectCurrentWorkspaceId,
  setCurrentWorkspaceId,
  selectProjectId,
} from "@views/app-manager/index.slice";
import "@containers/app-manager-sider/index.style";

const { Sider } = Layout;

const AppManagerSider = () => {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectProjectId);
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const { data: workspaceList } = useFetchWorkspaceListQuery(projectId);
  const modalRef = useRef<any>();

  const handleMenuClick = useCallback(
    ({ key }) => {
      dispatch(setCurrentWorkspaceId(key));
    },
    [dispatch]
  );

  const handleAddWorkspaceVisible = useCallback(() => {
    modalRef.current.show();
  }, []);

  const renderMenuIcon = useMemoCallback((id) => {
    return (
      <Icon
        type={+workspaceId === +id ? "wenjianjiacaisedakai" : "wenjianjiacaise"}
      />
    );
  });

  return (
    <div className="app-manager-sider">
      <Sider trigger={null} collapsible theme="light" width={240}>
        <div className="search">
          <Input
            size="large"
            bordered={false}
            className="input"
            placeholder="请输入工作区名称"
            prefix={<Icon type="sousuo" className="search-icon" />}
          />
        </div>
        {workspaceId && (
          <>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={[`${workspaceId}`]}
              onClick={handleMenuClick}
            >
              {workspaceList?.map((workspace: any) => (
                <Menu.Item
                  key={workspace.id}
                  icon={renderMenuIcon(workspace.id)}
                >
                  {workspace.name}
                </Menu.Item>
              ))}
            </Menu>
            <div className="add-workspace">
              <Button
                className="button"
                size="large"
                type="default"
                icon={<Icon type="xinzeng" />}
                onClick={handleAddWorkspaceVisible}
              >
                新增工作区
              </Button>
            </div>
          </>
        )}
      </Sider>
      <AddWorkspaceModal ref={modalRef} />
    </div>
  );
};

export default AppManagerSider;
