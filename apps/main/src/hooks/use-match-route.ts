import { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";

export default function useMatchRoute() {
  const match = useRouteMatch();

  return useMemo(() => {
    return match.path.replace(/\/$/, "");
  }, [match.path]);
}
