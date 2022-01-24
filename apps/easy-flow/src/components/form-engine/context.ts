import { createContext, useContext } from "react";
import { FormValue } from "@type/detail";
import { FormInstance } from "antd";
import { formRulesItem } from "./utils";

interface FormConfigContext {
  handleValueChange: () => void;

  getPopupContainer(): HTMLDivElement;
}

export default createContext<FormConfigContext | undefined>(undefined);

// 传给底层组件(容器组件 | 基础组件)的props；
interface IContainerContext {
  rules: formRulesItem[];
  children?: React.ReactNode;
  nodeType: string;
  fieldName: string;
  form: FormInstance<FormValue>;
  type: string;
  [key: string]: any;
}

export const ContainerContext = createContext<IContainerContext>({} as any);

ContainerContext.displayName = "ContainerContext";

export const ContainerProvider = ContainerContext.Provider;
export const ContainerConsumer = ContainerContext.Consumer;

export function useContainerContext() {
  const container = useContext<IContainerContext>(ContainerContext);
  return container;
}
