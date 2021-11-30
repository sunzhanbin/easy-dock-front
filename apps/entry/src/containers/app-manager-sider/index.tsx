import { useCallback, useRef } from "react";
import { Layout, Menu, Button } from "antd";
import { useFetchWorkspaceListQuery } from "@/http";
import { useAppDispatch, useAppSelector } from "@/store";
import AddWorkspaceModal from "@/components/add-workspace-modal";
import {
  selectCurrentWorkspaceId,
  setCurrentWorkspaceId,
  selectProjectId,
} from "@views/app-manager/index.slice";

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

  return (
    <div className="app-manager-sider">
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
      <AddWorkspaceModal ref={modalRef} />
    </div>
  );
};

export default AppManagerSider;
