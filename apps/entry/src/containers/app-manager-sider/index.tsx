import { useCallback, useMemo, useRef, useState } from "react";
import { Layout, Menu, Button, Input, Dropdown, message } from "antd";
import { useDeleteWorkspaceMutation, useFetchWorkspaceListQuery } from "@/http";
import { useAppDispatch, useAppSelector } from "@/store";
import AddWorkspaceModal from "@components/add-workspace-modal";
import useMemoCallback from "@common/hooks/use-memo-callback";
import Popconfirm from "@components/popconfirm";
import Icon from "@assets/icon";
import {
  selectCurrentWorkspaceId,
  setCurrentWorkspaceId,
} from "@views/app-manager/index.slice";
import "@containers/app-manager-sider/index.style";
import { selectProjectId } from "@/views/home/index.slice";
import { ResponseType } from "@/consts";

const { Sider } = Layout;

const AppManagerSider = () => {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectProjectId);
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const [deleteSubApp] = useDeleteWorkspaceMutation();
  const { data: initWorkspaceList } = useFetchWorkspaceListQuery(projectId);
  const [name, setName] = useState<string>("");
  const workspaceList = useMemo(() => {
    if (!Array.isArray(initWorkspaceList)) {
      return [];
    }
    return initWorkspaceList.filter((workspace) =>
      workspace.name.includes(name)
    );
  }, [initWorkspaceList, name]);
  const modalRef = useRef<any>();
  const inputRef = useRef<any>();

  const handleMenuClick = useCallback(
    ({ key }) => {
      dispatch(setCurrentWorkspaceId(key));
    },
    [dispatch]
  );

  const handleAddWorkspaceVisible = useCallback(() => {
    modalRef.current.show();
    modalRef.current.setTitle("新增");
  }, []);

  const renderMenuIcon = useMemoCallback((id) => {
    return (
      <Icon
        type={
          +workspaceId === +id
            ? "custom-icon-wenjianjiacaisedakai"
            : "custom-icon-wenjianjiacaise"
        }
      />
    );
  });

  const handleEditWorkspaceName = useMemoCallback((e, item) => {
    e.domEvent.stopPropagation;
    e.domEvent.preventDefault;
    modalRef.current.show();
    modalRef.current.setTitle("编辑");
    modalRef.current.setWorkspaceName(item.name);
  });

  const handleSearch = useMemoCallback(() => {
    const name = inputRef.current.state.value;
    setName(name);
  });

  const handleDeleteWorkspace = async (id: number) => {
    console.log(id);
    try {
      const ret: ResponseType = await deleteSubApp(id);
      if (ret && ret.error) return;
      message.success("删除     成功!");
    } catch (e) {
      console.log(e);
    }
  };
  const renderDropdownMenu = (workspace: { name: string; id: number }) => {
    // console.log(workspace, "workspace");
    return (
      <Menu>
        <Menu.Item
          key="1"
          icon={<Icon type="custom-icon-bianji" />}
          onClick={(e) => handleEditWorkspaceName(e, workspace)}
        >
          编辑
        </Menu.Item>
        <Menu.Item key="2" icon={<Icon type="custom-icon-shanchu" />}>
          <Popconfirm
            title="提示"
            content="删除后不可恢复,请确认是否删除该子应用?"
            placement="bottom"
            onConfirm={() => handleDeleteWorkspace(workspace.id)}
          >
            删除
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className="app-manager-sider">
      <Sider trigger={null} collapsible theme="light" width={240}>
        <div className="search">
          <Input
            size="large"
            bordered={false}
            ref={inputRef}
            className="input"
            placeholder="请输入工作区名称"
            prefix={
              <Icon
                type="custom-icon-sousuo"
                className="search-icon"
                onClick={handleSearch}
              />
            }
            onPressEnter={handleSearch}
          />
        </div>
        {workspaceId && (
          <Menu
            theme="light"
            mode="inline"
            className="menu-list"
            defaultSelectedKeys={[`${workspaceId}`]}
            onClick={handleMenuClick}
          >
            {workspaceList?.map((workspace: any) => (
              <Menu.Item key={workspace.id} icon={renderMenuIcon(workspace.id)}>
                {workspace.name}
                <Dropdown
                  overlay={() => renderDropdownMenu(workspace)}
                  overlayClassName="dropdown-sider-container"
                  placement="bottomCenter"
                >
                  <a>
                    <Icon
                      className="icon-dropdown"
                      type="custom-icon-gengduo"
                    />
                  </a>
                </Dropdown>
              </Menu.Item>
            ))}
          </Menu>
        )}
        <div className="add-workspace">
          <Button
            className="button"
            size="large"
            type="default"
            icon={<Icon type="custom-icon-xinzeng" />}
            onClick={handleAddWorkspaceVisible}
          >
            新增工作区
          </Button>
        </div>
      </Sider>
      <AddWorkspaceModal ref={modalRef} />
    </div>
  );
};

export default AppManagerSider;
