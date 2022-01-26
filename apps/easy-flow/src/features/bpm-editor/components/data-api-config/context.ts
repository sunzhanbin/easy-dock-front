import { createContext } from "react";
import { ParamReturn } from "./util";
import type { DataApiConfigProps } from "./index";

interface DataConfigContext {
  name: string[];
  fields: { name: string; id: string }[];
  detail?: {
    requireds: ParamReturn[];
    optionals: ParamReturn[];
    responses: ParamReturn[];
  };
  layout?: DataApiConfigProps["layout"];
  getPopupContainer(): HTMLDivElement;
}

export default createContext<DataConfigContext | undefined>(undefined);
