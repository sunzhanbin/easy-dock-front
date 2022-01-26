import { useMemo } from "react";
import { findPrevNodes } from "../util";
import { store } from "@/app/store";

export default function usePrevNodes(targetId?: string) {
  return useMemo(() => {
    if (!targetId) return [];

    return findPrevNodes(store.getState().flow.data, targetId);
  }, [targetId]);
}
