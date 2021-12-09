import { memo, useMemo, useCallback } from "react";
// import Auth from "@enc/sso";
import { useDispatch } from "react-redux";
import { Dropdown, Menu } from "antd";
import { useLogoutMutation } from "@/http";
import { Avatar, Icon } from "@common/components";
// import { userSelector, logout } from "@/store/user";
import "@components/header/index.style.scss";

function HeaderUser() {
  const dispatch = useDispatch();
  const handleLogin = async () => {
    //  todo
  };
  const handleLogout = useCallback(() => {
    useLogoutMutation();
  }, [dispatch]);

  const user = {
    info: {
      avatar: "Cxx",
      username: "Cxx",
    },
    cast: false,
  };
  const isAdmin = false;
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
  }, [isAdmin, handleLogout]);

  return (
    <>
      {user.info ? (
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
