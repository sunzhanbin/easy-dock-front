import { FC, memo } from 'react';
import ToolBoxItem from '@/components/toolbox-item';
import { useAppSelector } from '@app/hooks';
import { toolboxSelector } from './toolbox-reducer';
import Loading from '@components/loading';
import { map } from 'lodash';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styles from './index.module.scss';

const ToolBox: FC<{}> = () => {
  const components = useAppSelector(toolboxSelector);
  const comGroups = map(components, (value, key) => {
    return (
      <div className={styles.group} key={key}>
        <div className={styles.groupTitle}>{key}</div>
        <div className={styles.componentContainer}>
          {map(value, (tool, index) => {
            const { name, icon, type } = tool;
            return (
              <Draggable draggableId={type} index={+index} key={name}>
                {(dragProvided) => (
                  <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                    <ToolBoxItem icon={icon} displayName={name} type={type}></ToolBoxItem>
                  </div>
                )}
              </Draggable>
            );
          })}
        </div>
      </div>
    );
  });
  if (!comGroups) return <Loading></Loading>;
  return (
    <div className={styles.container}>
      <Droppable droppableId="component_zone">
        {(dropProvided) => (
          <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
            <div>{comGroups}</div>
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(ToolBox);
