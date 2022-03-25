// 流程编排模式--preview | edit
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function useFlowMode() {
  const location = useLocation();
  return useMemo<string>(() => {
    if (location?.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get("mode") || "edit";
    }
    return "edit";
  }, [location.search]);
}
