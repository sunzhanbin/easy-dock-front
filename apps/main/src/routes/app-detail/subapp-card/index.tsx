import React, { memo, useMemo, useState, FC, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import FlowImage from '@assets/flow-big.png';
import ScreenImage from '@assets/screen-big.png';
import { axios, getShorterText } from '@/utils';
import { Icon } from '@/components';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FlowMicroApp } from '@/consts';
import { message, Popconfirm } from 'antd';
import AppModel from '../app-model';

const CardContainer = styled.div`
  position: relative;
  display: flex;
  cursor: pointer;
  .image {
    flex: 0 0 74px;
  }
  .content {
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
        }
      }
      .operation {
        position: absolute;
        top: 28px;
        right: 0;
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
  name: string;
  status: number;
  type: 1 | 2;
  className?: string;
  version?: { id: number; remark: string; version: string } | null | undefined;
  onChange: Function;
}> = ({ id, name, status, type, className, version, onChange }) => {
  const [isShowOperation, setIsShowOperation] = useState<boolean>(false);
  const [isShowModel, setIsShowModel] = useState<boolean>(false);
  const history = useHistory();
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
    history.push(`${FlowMicroApp.route}/bpm-editor/${id}/form-design`);
  }, [id, history]);
  const handleShowOperation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShowOperation(true);
  }, []);
  const handleStart = useCallback(
    (e) => {
      e.stopPropagation();
      axios.put('/subapp/status', { id, status: 1 }).then(() => {
        setIsShowOperation(false);
        message.success('启用成功!');
        onChange && onChange();
      });
    },
    [id, setIsShowOperation, onChange],
  );
  const handleCancel = useCallback(() => {
    setIsShowOperation(false);
  }, [setIsShowOperation]);
  const handleStop = useCallback(
    (e) => {
      e.stopPropagation();
      axios.put('/subapp/status', { id, status: -1 }).then(() => {
        setIsShowOperation(false);
        message.success('停用成功!');
        onChange && onChange();
      });
    },
    [id, setIsShowOperation, onChange],
  );
  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsShowOperation(false);
      setIsShowModel(true);
    },
    [setIsShowModel, setIsShowOperation],
  );
  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      setIsShowOperation(false);
      axios.delete(`/subapp/${id}`).then(() => {
        message.success('删除成功!');
        onChange && onChange();
      });
    },
    [id, setIsShowOperation, onChange],
  );
  const handleOK = useCallback(
    (name) => {
      axios.put('/subapp', { id, name }).then(() => {
        message.success('编辑成功!');
        setIsShowModel(false);
        onChange && onChange();
      });
    },
    [id, setIsShowModel, onChange],
  );
  useEffect(() => {
    const handleHide = (e: MouseEvent) => {
      if ((e.target as HTMLDivElement).parentElement?.className !== 'app_operation_item') {
        setIsShowOperation(false);
      }
    };
    // 点击其他地方收起操作按钮
    document.body.addEventListener('click', handleHide);
    return () => {
      document.body.removeEventListener('click', handleHide);
    };
  }, []);
  return (
    <CardContainer className={className} onClick={handleJump}>
      <div className="image" style={{ backgroundColor: type === 1 ? '#DFF5EF' : '#E7EBFD' }}>
        <img src={type === 1 ? ScreenImage : FlowImage} alt="图片" />
      </div>
      <div className="content">
        <div className="header">
          <div className="name">{getShorterText(name)}</div>
          <div className="icon_wrapper" onClick={handleShowOperation}>
            <Icon type="gengduo" className="more" />
          </div>
          {isShowOperation && (
            <div
              className="operation subApp_card_operation"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {statusObj.className !== 'used' && (
                <Popconfirm
                  title="请确认是否启用该子应用?"
                  onConfirm={handleStart}
                  onCancel={handleCancel}
                  okText="确认"
                  cancelText="取消"
                >
                  <div className="app_operation_item">
                    <Icon type="gou" />
                    <div>启用</div>
                  </div>
                </Popconfirm>
              )}
              {statusObj.className === 'used' && (
                <Popconfirm
                  title="请确认是否停用该子应用?"
                  onConfirm={handleStop}
                  onCancel={handleCancel}
                  okText="确认"
                  cancelText="取消"
                >
                  <div className="app_operation_item">
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
                  title="删除后不可恢复,请确认是否删除该子应用?"
                  onConfirm={handleDelete}
                  onCancel={handleCancel}
                  okText="确认"
                  cancelText="取消"
                >
                  <div className="app_operation_item">
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
            className="edit_model"
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
