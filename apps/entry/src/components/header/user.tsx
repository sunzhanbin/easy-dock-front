import { memo, useMemo, useCallback } from "react";
// import { useDispatch } from "react-redux";
import { Dropdown, Menu } from "antd";
import { useLazyLogoutQuery } from "@/http";
import { Avatar } from "@common/components";
import Icon from "@assets/icon";

// import { userSelector, logout } from "@/store/user";
import "@components/header/index.style.scss";

function HeaderUser() {
  const handleLogin = async () => {
    //  todo
  };
  const handleLogout = useCallback(() => {
    useLazyLogoutQuery();
  }, []);

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
            <Icon type="custom-icon-tuichudenglu" className="icon" />
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
