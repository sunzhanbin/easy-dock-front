import React, { useCallback, useRef, useState } from 'react';
import { Layout, Menu, Button, Input, Dropdown, message } from 'antd';
import { useDeleteWorkspaceMutation, useFetchWorkspaceListQuery } from '@/http';
import { useAppDispatch, useAppSelector } from '@/store';
import AddWorkspaceModal from '@components/add-workspace-modal';
import useMemoCallback from '@common/hooks/use-memo-callback';
import Popconfirm from '@components/popconfirm';
import { Icon, Text } from '@common/components';
import { selectCurrentWorkspaceId, setCurrentWorkspaceId } from '@views/app-manager/index.slice';
import '@containers/app-manager-sider/index.style';
import { selectProjectId } from '@/views/home/index.slice';
import { handleStopPropagation } from '@utils/utils';

const { Sider } = Layout;

const AppManagerSider = () => {
  const modalRef = useRef<any>();
  const inputRef = useRef<any>();
  const [name, setName] = useState<string>('');
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectProjectId);
  const workspaceId = useAppSelector(selectCurrentWorkspaceId);
  const [deleteSubApp] = useDeleteWorkspaceMutation();
  const { workspaceList } = useFetchWorkspaceListQuery(projectId, {
    selectFromResult: ({ data }) => ({
      workspaceList: data?.filter((workspace: any) => workspace.name.includes(name))?.filter(Boolean),
    }),
  });

  const handleMenuClick = useCallback(
    ({ key }) => {
      dispatch(setCurrentWorkspaceId(key));
    },
    [dispatch],
  );

  const handleAddWorkspaceVisible = useCallback(() => {
    modalRef.current.show();
    modalRef.current.setTitle('新增');
  }, []);

  const renderMenuIcon = useMemoCallback((id) => {
    return <Icon type={+workspaceId === +id ? 'wenjianjiacaisedakai' : 'wenjianjiacaise'} />;
  });

  const handleEditWorkspaceName = useMemoCallback((e: React.MouseEvent, item) => {
    e.stopPropagation();
    modalRef.current.show();
    modalRef.current.setTitle('编辑');
    modalRef.current.setWorkspaceName(item.name);
  });

  const handleSearch = useMemoCallback(() => {
    const name = inputRef.current.state.value;
    setName(name);
  });

  const handleDeleteWorkspace = async (e: React.MouseEvent | undefined, id: number) => {
    try {
      if (e) {
        e.stopPropagation();
      }
      await deleteSubApp(id).unwrap();
      message.success('删除成功!');
    } catch (e) {
      console.log(e);
    }
  };
  const renderDropdownMenu = (workspace: { name: string; id: number }) => {
    return (
      <div className="workspace-operation">
        <div className="edit" onClick={(e) => handleEditWorkspaceName(e, workspace)}>
          <Icon type="bianji" className="icon" />
          <span className="text">编辑</span>
        </div>
        <Popconfirm
          title="提示"
          content="删除后不可恢复,请确认是否删除该工作区?"
          placement="bottom"
          onConfirm={(e) => handleDeleteWorkspace(e, workspace.id)}
          onCancel={(e) => e?.stopPropagation()}
        >
          <div className="delete" onClick={handleStopPropagation}>
            <Icon type="shanchu" />
            <span className="text">删除</span>
          </div>
        </Popconfirm>
      </div>
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
            prefix={<Icon type="sousuo" className="search-icon" onClick={handleSearch} />}
            onPressEnter={handleSearch}
          />
        </div>
        {workspaceId ? (
          <Menu
            theme="light"
            mode="inline"
            className="menu-list"
            selectedKeys={[`${workspaceId}`]}
            onClick={handleMenuClick}
          >
            {workspaceList?.map((workspace: any) => (
              <Menu.Item icon={renderMenuIcon(workspace.id)} key={workspace.id}>
                <div className="text">
                  <Text text={workspace.name} />
                </div>
                <Dropdown
                  trigger={['click']}
                  placement="bottomRight"
                  overlayClassName="dropdown-sider-container"
                  overlay={() => renderDropdownMenu(workspace)}
                >
                  <span onClick={handleStopPropagation}>
                    <Icon className="icon-dropdown" type="gengduo" />
                  </span>
                </Dropdown>
              </Menu.Item>
            ))}
          </Menu>
        ) : (
          <div className="menu-list" />
        )}
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
      </Sider>
      <AddWorkspaceModal ref={modalRef} />
    </div>
  );
};

export default AppManagerSider;
