import React, { memo, useMemo, useState, FC, useCallback, useRef } from 'react';
import styled from 'styled-components';
import FlowImage from '@assets/flow-big.png';
import ScreenImage from '@assets/screen-big.png';
import { axios, getShorterText } from '@/utils';
import { Popconfirm, Icon } from '@components';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FlowMicroApp, ChartMicroApp } from '@/consts';
import { message, Tooltip } from 'antd';
import AppModel from '../app-model';
import { stopPropagation } from '@consts';
import useMemoCallback from '@common/hooks/use-memo-callback';

const CardContainer = styled.div`
  position: relative;
  display: flex;
  cursor: pointer;
  transition: all ease-in-out 0.3s;

  &:hover {
    box-shadow: 0px 6px 24px 0px rgba(24, 31, 67, 0.1);
    border-radius: 3px;
  }
  .image {
    flex: 0 0 74px;
    & > img {
      width: 100%;
    }
  }
  & > .content {
    flex: 1;
    padding: 16px;
    background: rgba(24, 39, 67, 0.03);
    border-radius: 0 3px 3px 0;
    &:hover {
      .header {
        .icon_wrapper {
          display: block;
        }
      }
    }
    .header {
      position: relative;
      display: flex;
      justify-content: space-between;
      .name {
        font-size: 14px;
        font-weight: 400;
        color: #181f43;
        line-height: 22px;
      }
      .icon_wrapper {
        display: none;
        width: 20px;
        height: 20px;
        cursor: pointer;
        .more {
          display: block;
          width: 20px;
          height: 20px;
          &:hover {
            color: $primary-color;
          }
        }
      }
      .operation {
        position: absolute;
        top: 28px;
        right: 0;
        z-index: 8;
        width: 92px;
        padding: 16px;
        background: rgba(26, 27, 30, 0.85);
        border-radius: 3px;
        color: #fff;
        cursor: default;
        .app_operation_item {
          display: flex;
          align-items: center;
          height: 20px;
          line-height: 20px;
          margin-bottom: 16px;
          cursor: pointer;
          &:hover {
            color: rgba(255, 255, 255, 0.8);
            & > svg {
              color: rgba(255, 255, 255, 0.8);
            }
          }
          & > svg {
            flex: 0 0 20px;
            font-size: 18px;
            margin-right: 12px;
            color: #fff;
          }
          & > div {
            flex: 1;
            font-weight: 400;
            font-size: 14px;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 19px;
      .status {
        width: 48px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 400;
        color: #fff;
        background: rgba(6, 196, 152, 0.12);
        &.editing {
          background: #ecc58c;
        }
        &.used {
          background: #06c498;
        }
        &.stoped {
          background: #acbfba;
        }
      }
      .type {
        font-size: 12px;
        font-weight: 400;
        color: rgba(24, 31, 67, 0.5);
        line-height: 20px;
      }
    }
  }
`;

type StatusMap = {
  className: string;
  text: string;
  status: number;
};

const Card: FC<{
  id: number;
  containerId?: string;
  name: string;
  status: number;
  type: 1 | 2;
  className?: string;
  version?: { id: number; remark: string; version: string } | null | undefined;
  onChange: Function;
}> = ({ id, containerId, name, status, type, className, version, onChange }) => {
  const [isShowOperation, setIsShowOperation] = useState<boolean>(false);
  const [isShowModel, setIsShowModel] = useState<boolean>(false);
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const statusObj: StatusMap = useMemo(() => {
    // 未发布(没有版本信息)的子应用为编排中状态
    if (!version) {
      return {
        className: 'editing',
        text: '编排中',
        status: 0,
      };
    }
    return status === 1
      ? { className: 'used', text: '已启用', status: 1 }
      : { className: 'stoped', text: '已停用', status: -1 };
  }, [status, version]);
  const handleJump = useCallback(() => {
    if (type === 1) {
      history.push(`${ChartMicroApp.route}/chart-editor/${id}/chart-design`);
    } else {
      history.push(`${FlowMicroApp.route}/bpm-editor/${id}/form-design`);
    }
  }, [id, type, history]);
  const handleShowOperation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShowOperation(true);
  }, []);
  const getPopupContainer = useMemo(() => {
    if (containerId) {
      return () => document.getElementById(containerId)!;
    }
    return () => containerRef.current!;
  }, [containerId]);
  const hideOperation = useMemoCallback((msg: string) => {
    setIsShowOperation(false);
    message.success(msg);
    onChange && onChange();
  });
  const handleStart = useCallback(() => {
    axios.put('/subapp/status', { id, status: 1 }).then(() => {
      hideOperation('启用成功!');
    });
  }, [id, onChange]);
  const handleStop = useCallback(() => {
    axios.put('/subapp/status', { id, status: -1 }).then(() => {
      hideOperation('停用成功!');
    });
  }, [id, onChange]);
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShowOperation(false);
    const { x = 0 } = containerRef.current?.getBoundingClientRect() as DOMRect;
    if (document.body.clientWidth - x < 400) {
      setPosition('right');
    }
    setIsShowModel(true);
  }, []);
  const handleDelete = useCallback(() => {
    setIsShowOperation(false);
    axios.delete(`/subapp/${id}`).then(() => {
      message.success('删除成功!');
      onChange && onChange();
    });
  }, [id, onChange]);
  const handleOK = useCallback(
    (name) => {
      axios.put('/subapp', { id, name }).then(() => {
        message.success('编辑成功!');
        setIsShowModel(false);
        onChange && onChange();
      });
    },
    [id, onChange],
  );

  return (
    <CardContainer
      className={className}
      ref={containerRef}
      onClick={handleJump}
      onMouseLeave={() => {
        setIsShowOperation(false);
      }}
    >
      <div className="image" style={{ backgroundColor: type === 1 ? '#DFF5EF' : '#E7EBFD' }}>
        <img src={type === 1 ? ScreenImage : FlowImage} alt="图片" />
      </div>
      <div className="content">
        <div className="header">
          <div className="name">
            {name.length > 8 ? (
              <Tooltip title={name}>
                <div>{getShorterText(name)}</div>
              </Tooltip>
            ) : (
              <div>{name}</div>
            )}
          </div>
          <div className="icon_wrapper" onClick={handleShowOperation}>
            <Icon type="gengduo" className="more" />
          </div>
          {isShowOperation && (
            <div className="operation subApp_card_operation" onClick={stopPropagation}>
              {statusObj.className === 'stoped' && (
                <Popconfirm
                  title="提示"
                  content="请确认是否启用该子应用?"
                  placement="bottom"
                  onConfirm={handleStart}
                  getPopupContainer={getPopupContainer}
                >
                  <div className="app_operation_item" onClick={stopPropagation}>
                    <Icon type="gou" />
                    <div>启用</div>
                  </div>
                </Popconfirm>
              )}
              {statusObj.className === 'used' && (
                <Popconfirm
                  title="提示"
                  content="请确认是否停用该子应用?"
                  placement="bottom"
                  onConfirm={handleStop}
                  getPopupContainer={getPopupContainer}
                >
                  <div className="app_operation_item" onClick={stopPropagation}>
                    <Icon type="guanbi" />
                    <div>停用</div>
                  </div>
                </Popconfirm>
              )}
              <div className="app_operation_item" onClick={handleEdit}>
                <Icon type="bianji" />
                <div>编辑</div>
              </div>
              {statusObj.className !== 'used' && (
                <Popconfirm
                  title="提示"
                  content="删除后不可恢复,请确认是否删除该子应用?"
                  placement="bottom"
                  onConfirm={handleDelete}
                  getPopupContainer={getPopupContainer}
                >
                  <div className="app_operation_item" onClick={stopPropagation}>
                    <Icon type="shanchu" />
                    <div>删除</div>
                  </div>
                </Popconfirm>
              )}
            </div>
          )}
        </div>
        <div className="footer">
          <div className={classNames('status', statusObj.className)}>{statusObj.text}</div>
          <div className="type">{type === 1 ? '大屏' : '流程'}</div>
        </div>
        {isShowModel && (
          <AppModel
            type="edit"
            position={position}
            className="edit_model"
            name={name}
            onClose={() => {
              setIsShowModel(false);
            }}
            onOk={handleOK}
          />
        )}
      </div>
    </CardContainer>
  );
};

export default memo(Card);
