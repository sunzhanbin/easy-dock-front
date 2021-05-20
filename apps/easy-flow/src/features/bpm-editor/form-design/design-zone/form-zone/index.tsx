import React, { FC, memo, useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import SourceBox from '@/components/source-box';
import { store } from '@app/store';
import { useDispatch } from 'react-redux';
import { selectField } from '../../formdesign-slice';
import { FormFieldMap } from '@/type';

const FormZoneContainer = styled.div`
  max-width: 900px;
  width: 100%;
  height: 100%;
  .form-zone {
    background: #fff;
    box-shadow: 0 2px 4px 0 rgb(43 52 65 / 10%);
    min-height: 200px;
    margin-bottom: 30px;
    .form_row{
      &:first-child{
        padding-top:12px;
      }
      &:last-child{
        padding-bottom:12px;
      }
      display:flex;
      padding:0 12px;
      
      .form_item{
        position: relative;
        display: inline-block;
        padding: 12px;
        border-radius: 6px;
        &:hover{
          background: #fafafb;
        }
        &.active{
          background: #eff3fd;
          .operation{
            display:flex;
          }
        }
      }
    }
  }
`;

type TLayoutItem = Array<string>

const FormZone: FC<{}> = () => {
  const dispatch = useDispatch();
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
  }, [])
  const content = useMemo(() => {
    return (
      <>
        {
          layout.map((row, index) => (
            <div className="form_row" key={index}>
              {
                row.map(id => {
                  return (
                    <div
                      key={id}
                      className={`form_item ${id === selectId ? 'active' : ''}`}
                      style={{ width: row.length === 1 ? '100%' : row.length === 2 ? '50%' : '25%' }}
                      onClick={() => { handleSelect(id) }}
                    >
                      <SourceBox type={idObject[id].type} config={idObject[id]} />
                    </div>
                  )
                })
              }
            </div>
          ))
        }
      </>
    )
  }, [layout, idObject, selectId])
  return (
    <FormZoneContainer>
      <div className="form-zone">{content}</div>
    </FormZoneContainer>
  );
};

export default memo(FormZone);
