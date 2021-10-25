import {createContext} from "react";

interface FormConfigContext {

  handleValueChange: () => void

  getPopupContainer(): HTMLDivElement;
}

export default createContext<FormConfigContext | undefined>(undefined)