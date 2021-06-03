import React, { memo, FC, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector, layoutSelector } from '../form-design/formzone-reducer';
import { Col, Row } from 'antd';
import SourceBox from '@/components/source-box';

const Container = styled.div`
  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 64px;
    line-height: 64px;
    background: #ffffff;
    border-bottom: 1px solid rgba(24, 31, 67, 0.12);
    padding: 0 68px;
    .title {
      float: left;
      font-size: 18px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
    .close {
      float: right;
      width: 20px;
      height: 20px;
      margin-top: 22px;
    }
  }
  .content {
    width: 60%;
    margin-left: 20%;
    margin-top: 64px;
    .title {
      height: 34px;
      font-size: 24px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      line-height: 34px;
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
      text-align: center;
      line-height: 200px;
      font-size: 16px;
      color: #dcdcdc;
    }
  }
`;
const spaceMap = {
  1: 6,
  2: 12,
  3: 18,
  4: 24,
};

const PreviewForm: FC = () => {
  const layout = useAppSelector(layoutSelector);
  const byId = useAppSelector(componentPropsSelector);
  const getColSpace = useCallback(
    (id: string) => {
      const space = byId[id]?.colSpace;
      if (space) {
        return spaceMap[space];
      }
    },
    [byId],
  );
  const formContent = useMemo(() => {
    return (
      <div className="form_design">
        
      </div>
    );
  }, [layout, byId]);
  return (
    <Container>
      <div className="header">
        <div className="title">预览表单</div>
        <div className="close">
          <span className="iconfont iconguanbi"></span>
        </div>
      </div>
      <div className="content">
        <div className="title">燃气保修</div>
        <div className="form_content">{formContent}</div>
      </div>
    </Container>
  );
};

export default memo(PreviewForm);
