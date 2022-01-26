import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NoMatch = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // 没有权限/匹配不到统一定位到首页v1.2.0
    navigate("/home");
  }, [navigate]);
  return null;
};

export default NoMatch;
