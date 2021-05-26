import React, { FC, memo, useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import SourceBox from '@/components/source-box';
import { Form, Row, Col } from 'antd';
import { store } from '@app/store';
import { useDispatch } from 'react-redux';
import { selectField } from '../../formdesign-slice';
import { FormFieldMap, MoveConfig } from '@/type';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const FormZoneContainer = styled.div`
  max-width: 900px;
  width: 100%;
  height: 100%;
  .form-zone {
    background: #fff;
    box-shadow: 0 2px 4px 0 rgb(43 52 65 / 10%);
    min-height: 200px;
    margin-bottom: 30px;
    padding: 12px 0;
    >div{
      min-height: 200px;
    }
    .form_row{
      display:flex;
      padding:0 12px;
      
      .form_item{
        position: relative;
        display: inline-block;
        padding: 12px 16px;
        border-radius: 3px;
        border:1px solid transparent;
        &:hover{
          border: 1px dashed rgba(24, 31, 67, 0.3);
        }
        &.active{
          border: 1px dashed #818A9E;
          .operation,
          .moveUp,
          .moveDown,
          .moveLeft,
          .moveRight{
            display:block;
          }
        }
        .ant-form-item{
          margin-bottom: 0;
          .ant-form-item-label{
            padding-bottom: 4px;
            >label{
              display: block;
              line-height: 20px;
              .label_container{
                .label{
                  font-size: 12px;
                  font-weight: 500;
                  color: rgba(24, 31, 67, 0.95);
                  line-height: 20px;
                  margin-bottom: 2px;
                }
                .tip{
                  font-size: 12px;
                  font-weight: 400;
                  color: rgba(24, 31, 67, 0.5);
                  line-height: 20px;
                  word-break: break-all;
                }
              }
            }
          }
        }
      }
    }
  }
`;

type TLayoutItem = Array<string>

const spaceMap = {
  1: 6,
  2: 12,
  3: 18,
  4: 24,
}

const FormZone: FC<{}> = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [layout, setLayout] = useState<TLayoutItem[]>([]);
  const [idObject, setIdObject] = useState<FormFieldMap>({});
  const [selectId, setSelectId] = useState<string>('');
  useEffect(() => {
    store.subscribe(() => {
      const formDesign = store.getState().formDesign;
      const layoutList = formDesign.layout || [];
      setIdObject(formDesign.byId || {});
      setLayout(layoutList);
    })
  }, []);
  const handleSelect = useCallback((id) => {
    dispatch(selectField({ id }))
    const formDesign = store.getState().formDesign;
    setSelectId((formDesign.selectedField as string))
  }, []);
  const getColSpace = useCallback((id) => {
    const space = idObject[id].colSpace;
    if (space) {
      return spaceMap[space];
    }
  }, [idObject]);
  const getMoveConfig = useCallback((rowIndex, colIndex, flag?) => {
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
  }, [layout])
  const content = useMemo(() => {
    return (
      <Droppable droppableId="form_zone" direction="vertical">
        {
          (dropProvided) => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              <Form form={form} name="form_design" layout="vertical">
                {
                  layout.map((row, rowIndex) => (
                    <Draggable draggableId={row[0]} index={rowIndex} key={row[0]}>
                      {
                        (dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <Row className="form_row" key={rowIndex}>
                              {
                                row.map((id, colIndex) => (
                                  <Col
                                    key={id}
                                    className={`form_item ${id === selectId ? 'active' : ''}`}
                                    onClick={() => { handleSelect(id) }}
                                    span={getColSpace(id)}
                                  >
                                    <SourceBox
                                      type={idObject[id].type}
                                      config={idObject[id]}
                                      moveConfig={getMoveConfig(rowIndex, colIndex)}
                                      id={id}
                                      form={form}
                                      rowIndex={rowIndex}
                                    />
                                  </Col>
                                ))
                              }
                            </Row>
                          </div>
                        )
                      }
                    </Draggable>

                  ))
                }
              </Form>
              {dropProvided.placeholder}
            </div>
          )
        }
      </Droppable>

    )
  }, [layout, idObject, selectId])
  return (
    <FormZoneContainer>
      <div className="form-zone">{content}</div>
    </FormZoneContainer>
  );
};

export default memo(FormZone);
