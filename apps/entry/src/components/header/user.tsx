import { memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { auth } from "@/consts";
import { useGetUserInfoQuery } from "@/http";
import { Avatar, Icon, Text } from "@common/components";
import { logout } from "@views/home/index.slice";
import "@components/header/index.style.scss";
import { RoleEnum } from "@utils/types";
import { useDispatch } from "react-redux";
import { clearCookies } from "@/utils/utils";

type HeaderUserProps = {
  showProject?: boolean; // 首页不展示用户头像
};

function HeaderUser({ showProject }: HeaderUserProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const skip = !auth.getAuth(); // 判断无权限时不走获取用户信息接口
  const { user } = useGetUserInfoQuery(undefined, {
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
    skip,
  });

  const handleLogin = async () => {
    // 重定向前先清除cookie
    clearCookies();
    await auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
  };

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // 当前角色是否是超管 v1.2.2新增
  const isAdmin = useMemo(() => {
    const power = user?.power || 0;
    return (power & RoleEnum.ADMIN) === RoleEnum.ADMIN;
  }, [user]);

  const handleGoAuth = useCallback(() => {
    navigate("/user-auth");
  }, [navigate]);

  const dropdownOverlay = useMemo(() => {
    return (
      <Menu>
        {isAdmin && (
          <>
            <Menu.Item key="auth" onClick={handleGoAuth} className="menuItem">
              <span>
                <Icon type="quanxianshezhi" className="icon-exit" />
                权限设置
              </span>
            </Menu.Item>
          </>
        )}
        <Menu.Item key="logout" onClick={handleLogout} className="menuItem">
          <span>
            <Icon type="tuichudenglu" className="icon-exit" />
            <span className="text-exit">退出登录</span>
          </span>
        </Menu.Item>
      </Menu>
    );
  }, [isAdmin, handleGoAuth, handleLogout]);

  return (
    <div className="user-container-component">
      {user ? (
        <Dropdown overlay={dropdownOverlay} getPopupContainer={(c) => c} placement="bottomLeft">
          <div className="user">
            {showProject && (
              <div className="avatar">
                <Avatar round size={32} src={user.avatar} name={user.username} />
              </div>
            )}
            <Text className="name">{user.username}</Text>
          </div>
        </Dropdown>
      ) : (
        <div className="login" onClick={handleLogin}>
          登录
        </div>
      )}
    </div>
  );
}

export default memo(HeaderUser);
