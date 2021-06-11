import React, { FC, memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
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

const FormZoneContainer = styled.div`
  width: 100%;
  height: 100%;
  .form-zone {
    position: relative;
    background: #fff;
    min-height: calc(100vh - 104px);
    margin-bottom: 30px;
    padding: 12px 0;
    > div {
      min-height: 200px;
    }
    .form_row {
      display: flex;
      padding: 0 12px;

      .form_item {
        position: relative;
        display: inline-block;
        padding: 12px 16px;
        border-radius: 3px;
        border: 1px solid transparent;
        &:hover {
          border: 1px dashed rgba(24, 31, 67, 0.3);
        }
        &.active {
          border: 1px dashed #818a9e;
          .operation,
          .moveUp,
          .moveDown,
          .moveLeft,
          .moveRight {
            display: block;
          }
        }
        .label_container {
          .label {
            font-size: 12px;
            font-weight: 500;
            color: rgba(24, 31, 67, 0.95);
            line-height: 20px;
            margin-bottom: 2px;
          }
          .tip {
            font-size: 12px;
            font-weight: 400;
            color: rgba(24, 31, 67, 0.5);
            line-height: 20px;
            word-break: break-all;
          }
        }
      }
    }
    .empty_tip {
      position: absolute;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 260px);
      height: calc(100% - 55px);
      text-align: center;
      font-size: 16px;
      color: #dcdcdc;
      border: 1px dashed #b9bbc6;
      .image {
        width: 107px;
        height: 53px;
        margin: 175px 70px 24px 30px;
      }
      .text {
        width: 216px;
        height: 28px;
        line-height: 28px;
        font-weight: 500;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.85);
        margin: 0 auto;
      }
    }
  }
`;

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
            <div className="form_design">
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
                              className={`form_item ${id === selectedField ? 'active' : ''}`}
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
                <div className="empty_tip">
                  <img src={emptyImage} className="image" alt="empty" />
                  <div className="text">拖动或点击左侧控件到这里</div>
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
    <FormZoneContainer>
      <div className="form-zone">{content}</div>
    </FormZoneContainer>
  );
};

export default memo(FormZone);
