import { memo, useMemo, useCallback } from "react";
// import { useHistory } from "react-router-dom";
import Auth from "@enc/sso";
import { useDispatch } from "react-redux";
import { Dropdown, Menu } from "antd";
import { Avatar, Icon } from "@common/components";

// import { userSelector, logout } from "@/store/user";
// import { ROUTES } from "@consts";
// import { RoleEnum } from "@/schema/app";
import "@components/header/index.style.scss";

function HeaderUser() {
  // const history = useHistory();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    console.log(
      window.EASY_DOCK_BASE_SERVICE_ENDPOINT,
      "window.EASY_DOCK_BASE_SERVICE_ENDPOINT"
    );
    await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
  };
  const handleLogout = useCallback(() => {
    // dispatch(logout());
  }, [dispatch]);

  const user = {
    info: {
      avatar: "cxx",
      username: "cxx",
    },
    cast: true,
  };
  const isAdmin = false;
  const handleGoAuth = useCallback(() => {
    // history.push(ROUTES.USER_MANAGER_AUTH);
  }, [history]);
  // 当前角色是否是超管
  // const isAdmin = useMemo(() => {
  //   const power = user.info?.power || 0;
  //   return (power & RoleEnum.ADMIN) === RoleEnum.ADMIN;
  // }, [user]);
  const dropdownOverlay = useMemo(() => {
    return (
      <Menu>
        {isAdmin && (
          <>
            <Menu.Item key="auth" onClick={handleGoAuth} className="menuItem">
              <span>
                <Icon type="quanxianshezhi" className="icon" />
                权限设置
              </span>
            </Menu.Item>
            <Menu.Item key="line" className="menuItem line" />
          </>
        )}
        <Menu.Item key="logout" onClick={handleLogout} className="menuItem">
          <span>
            <Icon type="tuichudenglu" className="icon" />
            退出登录
          </span>
        </Menu.Item>
      </Menu>
    );
  }, [isAdmin, handleGoAuth, handleLogout]);

  return (
    <>
      {user.cast ? (
        <Dropdown
          overlay={dropdownOverlay}
          getPopupContainer={(c) => c}
          placement="bottomLeft"
        >
          <div className="user">
            <div className="avatar">
              <Avatar
                round
                size={32}
                src={user.info.avatar}
                name={user.info.username}
              />
            </div>
            <div className="name">{user.info.username}</div>
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
