import { memo, useMemo, useCallback } from "react";
import Auth from "@enc/sso";
import { Dropdown, Menu } from "antd";
import { useGetUserInfoQuery, useLogoutMutation } from "@/http";
import { Avatar, Icon } from "@common/components";

// import { RoleEnum, AuthEnum } from "@utils/types";

// import { userSelector, logout } from "@/store/user";
import "@components/header/index.style.scss";

function HeaderUser() {
  const [logout] = useLogoutMutation();
  const { user } = useGetUserInfoQuery("", {
    selectFromResult: ({ data }) => {
      if (!data) return { user: null };
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
  });

  const handleLogin = async () => {
    await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
  };
  const handleLogout = useCallback(() => {
    logout("");
  }, [logout]);

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
            <Icon type="tuichudenglu" className="icon" />
            退出登录
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
            <div className="avatar">
              <Avatar round size={32} src={user.avatar} name={user.username} />
            </div>
            <div className="name">{user.username}</div>
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
