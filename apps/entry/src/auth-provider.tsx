import { Navigate, useLocation } from "react-router-dom";
import { auth } from "./consts";

function AuthProvider({ children }: { children: JSX.Element }) {
  const authentic = auth.getAuth();
  const location = useLocation();
  if (!authentic) {
    (async () => {
      await auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
    })();
    return null;
  }
  return children;
}

export default AuthProvider;
