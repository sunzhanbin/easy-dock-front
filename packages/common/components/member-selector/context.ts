import { createContext } from 'react';

export interface SelectorContext {
  projectId?: number;
  wrapperClass?: string;
}

export default createContext<SelectorContext | undefined>(undefined);
