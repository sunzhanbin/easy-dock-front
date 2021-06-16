import { FC, memo, useMemo, useCallback } from 'react';
import SourceBox from '@/components/source-box';
import { Row, Col } from 'antd';
import { selectField } from '../../formdesign-slice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  layoutSelector,
  componentPropsSelector,
  selectedFieldSelector,
} from '@/features/bpm-editor/form-design/formzone-reducer';
import { MoveConfig } from '@/type';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import emptyImage from '@assets/drag.png';
import styles from './index.module.scss';
import classNames from 'classnames';

const spaceMap = {
  1: 6,
  2: 12,
  3: 18,
  4: 24,
};

const FormZone: FC<{}> = () => {
  const dispatch = useAppDispatch();
  const layout = useAppSelector(layoutSelector);
  const byId = useAppSelector(componentPropsSelector);
  const selectedField = useAppSelector(selectedFieldSelector);
  const handleSelect = useCallback(
    (id) => {
      dispatch(selectField({ id }));
    },
    [dispatch],
  );
  const getColSpace = useCallback(
    (id) => {
      const space = byId[id]?.colSpace;
      if (space) {
        return spaceMap[space];
      }
    },
    [byId],
  );
  const getMoveConfig = useCallback(
    (rowIndex, colIndex, flag?) => {
      const config: MoveConfig = { up: true, down: false, left: true, right: true };
      if (rowIndex === 0 || layout[rowIndex - 1].length > 3) {
        config.up = false;
      }
      if (layout[rowIndex].length > 1) {
        config.down = true;
      }
      if (colIndex === 0) {
        config.left = false;
      }
      if (colIndex === layout[rowIndex].length - 1) {
        config.right = false;
      }
      return config;
    },
    [layout],
  );
  const content = useMemo(() => {
    return (
      <Droppable droppableId="form_zone" direction="vertical">
        {(dropProvided) => (
          <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
            <div className={styles.form_design}>
              {layout && layout.length > 0 ? (
                layout.map((row, rowIndex) => (
                  <Draggable draggableId={`${rowIndex}`} index={rowIndex} key={rowIndex}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                      >
                        <Row className="form_row" key={rowIndex}>
                          {row.map((id, colIndex) => (
                            <Col
                              key={id}
                              className={classNames('form_item', id === selectedField ? 'active' : '')}
                              onClick={() => {
                                handleSelect(id);
                              }}
                              span={getColSpace(id)}
                            >
                              <SourceBox
                                type={id ? id.split('_')[0] : ''}
                                config={byId[id]}
                                moveConfig={getMoveConfig(rowIndex, colIndex)}
                                id={id}
                                rowIndex={rowIndex}
                              />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className={styles.empty_tip}>
                  <img src={emptyImage} className={styles.image} alt="empty" />
                  <div className={styles.text}>拖动或点击左侧控件到这里</div>
                </div>
              )}
            </div>
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }, [layout, byId, selectedField, getColSpace, getMoveConfig, handleSelect]);
  return (
    <div className={styles.container}>
      <div className={styles.form_zone}>{content}</div>
    </div>
  );
};

export default memo(FormZone);
