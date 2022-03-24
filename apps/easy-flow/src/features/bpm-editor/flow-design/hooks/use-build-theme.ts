// 构建端主题色
import { useMemo, useEffect } from "react";
import { registerTheme } from "@theme/src/utils";
import { useSubAppDetail, setTheme } from "@/app/app";
import { useAppDispatch } from "@/app/hooks";

export default function useBuildTheme() {
  const location = window.location;
  const subApp = useSubAppDetail();

  const dispatch = useAppDispatch();

  const theme = useMemo<string>(() => {
    if (location?.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get("theme") || "light";
    }
    return subApp.theme || "light";
  }, [location.search, subApp.theme]);

  useEffect(() => {
    dispatch(setTheme(theme));
    registerTheme({
      theme,
    });
  }, [theme, dispatch]);
}
