import { memo, useMemo, useCallback } from "react";
import { Dropdown, Menu } from "antd";
import { auth } from "@/consts";
import { useGetUserInfoQuery } from "@/http";
import { Avatar, Icon, Text } from "@common/components";
import { logout } from "@views/home/index.slice";
import "@components/header/index.style.scss";
import { useDispatch } from "react-redux";

type HeaderUserProps = {
  showProject?: boolean;
}
function HeaderUser({showProject}: HeaderUserProps) {
  const dispatch = useDispatch();
  const skip = auth.getAuth() ? false : true;
  const { user } = useGetUserInfoQuery(undefined, {
    selectFromResult: ({ data }) => {
      if (!data) return {user: null};
      const { power, user } = data;
      return {
        user: {
          avatar: user.avatar,
          username: user.userName,
          id: user.id,
          power: power,
        },
      };
    },
    skip
  });

  const handleLogin = async () => {
    await auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
  };

  const handleLogout = useCallback(() => {
    console.log()
    dispatch(logout());
  }, [dispatch]);

  // 当前角色是否是超管 v1.2.0暂时不加
  // const isAdmin = useMemo(() => {
  //   const power = user?.power || 0;
  //   return (power & RoleEnum.ADMIN) === RoleEnum.ADMIN;
  // }, [user]);

  const dropdownOverlay = useMemo(() => {
    return (
      <Menu>
        <Menu.Item key="logout" onClick={handleLogout} className="menuItem">
          <span>
            <Icon type="tuichudenglu" className="icon-exit" />
            <span className="text-exit">退出登录</span>
          </span>
        </Menu.Item>
      </Menu>
    );
  }, [handleLogout]);

  return (
    <>
      {user ? (
        <Dropdown
          overlay={dropdownOverlay}
          getPopupContainer={(c) => c}
          placement="bottomLeft"
        >
          <div className="user">
            {
              showProject &&
              <div className="avatar">
                <Avatar round size={32} src={user.avatar} name={user.username}/>
              </div>
            }
            <Text className="name">{user.username}</Text>
          </div>
        </Dropdown>
      ) : (
        <div className="login" onClick={handleLogin}>
          登录
        </div>
      )}
    </>
  );
}

export default memo(HeaderUser);
