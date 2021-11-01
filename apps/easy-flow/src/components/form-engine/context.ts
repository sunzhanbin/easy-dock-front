import {createContext, useContext} from "react";

interface FormConfigContext {

  handleValueChange: () => void

  getPopupContainer(): HTMLDivElement;
}

export default createContext<FormConfigContext | undefined>(undefined)


export const ContainerContext = createContext({} as any);

ContainerContext.displayName = 'ContainerContext';

export const ContainerProvider = ContainerContext.Provider;
export const ContainerConsumer = ContainerContext.Consumer;

export function useContainerContext() {
  const container = useContext<any>(ContainerContext);
  return container;
};