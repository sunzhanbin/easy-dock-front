import React, { FC, memo, useCallback, useState, useMemo } from 'react';
import { Button, Tooltip } from 'antd';
import styled from 'styled-components';
import { useHistory, useRouteMatch, Link, NavLink, useLocation } from 'react-router-dom';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { save } from '../../features/bpm-editor/flow-design/flow-slice';
import { useAppDispatch } from '@/app/hooks';
import Header from '../header';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 100%;
  border-bottom: 1px solid rgba(24, 31, 67, 0.12);
  .edit_header {
    width: 100%;
    .steps {
      width: 220px;
      display: flex;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .step {
        height: 64px;
        line-height: 64px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(24, 31, 67, 0.5);
        .number {
          font-size: 18px;
          font-weight: bold;
          margin-right: 4px;
        }
        &.active {
          color: rgba(24, 31, 67, 0.95);
          border-bottom: 5px solid #4c5cdb;
        }
      }
      .separator {
        width: 16px;
        height: 64px;
        line-height: 64px;
        text-align: center;
        font-size: 12px;
        color: #818a9e;
        margin: 0 12px;
      }
    }
    .operation {
      display: flex;
      position: absolute;
      right: 0;
      height: 64px;
      line-height: 64px;
      .iconfont {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        color: #818a9e;
        margin-top: 22px;
        margin-right: 24px;
        cursor: pointer;
      }
      .prev {
        width: 74px;
        margin-top: 12px;
        margin-right: 12px;
      }
      .save {
        width: 60px;
        margin-top: 12px;
        margin-right: 12px;
        border-radius: 3px;
        border: 1px solid rgba(76, 92, 219, 0.85);
        font-size: 14px;
        font-weight: 400;
        color: #4c5cdb;
      }
      .next {
        width: 74px;
        margin-top: 12px;
        margin-right: 24px;
        background: #4c5cdb;
        border-radius: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
      }
      .publish {
        width: 74px;
        margin-top: 12px;
        margin-right: 24px;
        background: #4c5cdb;
        border-radius: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        .iconfont {
          margin: 0;
          margin-right: 4px;
          color: #fff;
          font-size: 16px;
        }
      }
    }
  }
`;

const EditorHeader: FC = () => {
  const dispatch = useAppDispatch();
  const match = useRouteMatch();
  const location = useLocation();
  const pathName = useMemo(() => {
    return location.pathname;
  }, [location]);
  const handlePreview = useCallback(() => {
    if (pathName === '/form-design') {
      console.info('preview form');
    }
  }, [pathName]);
  const handleSave = useCallback(() => {
    if (pathName === '/form-design') {
      console.info('save');
    }
    if (pathName === '/flow-design') {
      dispatch(save('appkey'));
    }
  }, [pathName]);
  const handleNext = useCallback(() => {
    if (pathName === '/form-design') {
      console.info('next');
    }
  }, [pathName]);

  return (
    <HeaderContainer>
      <Header backText="燃气报修" className="edit_header">
        <div className="steps">
          <NavLink className="step" to={`${match.path}form-design`} activeClassName="active">
            <span className="number">01</span>
            <span>表单设计</span>
          </NavLink>
          <div className="separator">
            <span className="iconfont iconjinru"></span>
          </div>
          <NavLink className="step" to={`${match.path}flow-design`} activeClassName="active">
            <span className="number">02</span>
            <span>流程设计</span>
          </NavLink>
        </div>
        <div className="operation">
          <span className="iconfont iconjiantoushangyibu"></span>
          <span className="iconfont iconjiantouxiayibu"></span>
          <Tooltip title="预览">
            <span className="iconfont iconyulan" onClick={handlePreview}></span>
          </Tooltip>
          {pathName === '/flow-design' && (
            <Button className="prev" size="large">
              上一步
            </Button>
          )}
          <Button type="primary" ghost className="save" size="large" onClick={handleSave}>
            保存
          </Button>
          {pathName === '/form-design' && (
            <Button type="primary" className="next" size="large" onClick={handleNext}>
              下一步
            </Button>
          )}
          {pathName === '/flow-design' && (
            <Button className="publish" type="primary" size="large" icon={<span className="iconfont iconfabu"></span>}>
              发布
            </Button>
          )}
        </div>
      </Header>
    </HeaderContainer>
  );
};

export default memo(EditorHeader);
