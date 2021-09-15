import React, { FC, memo} from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import styles from './index.module.scss';
import Container from './container';

const Editor: FC = () => {
  return (
    <div className={styles.editorContainer}>
      <DndProvider backend={HTML5Backend}>
        <Container/>
      </DndProvider>
    </div>
  );
};

export default memo(Editor);
