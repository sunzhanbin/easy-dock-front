import { memo, useCallback, useState, useMemo, FC } from 'react';
import styled from 'styled-components';
import { Icon } from '@/components';
import { Input, Button, Form } from 'antd';
import FlowImage from '@assets/flow-small.png';
import ScreenImage from '@assets/screen-small.png';
import { SubAppTypeEnum } from '@/schema/app';
import classNames from 'classnames';

const Container = styled.div`
  position: absolute;
  top: 104px;
  z-index: 8;
  width: 392px;
  background: #ffffff;
  box-shadow: 0px 6px 24px 0px rgba(24, 31, 67, 0.1);
  border-radius: 3px;
  padding: 16px;
  cursor: default;
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(24, 31, 67, 0.08);
    .title {
      height: 24px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(24, 31, 67, 0.75);
      line-height: 24px;
      margin-bottom: 12px;
    }
    .close {
      width: 20px;
      height: 20px;
      cursor: pointer;
      .icon {
        display: block;
        width: 20px;
        height: 20px;
      }
    }
  }
  .content {
    margin-top: 12px;
    .form-item {
      .label {
        height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(24, 31, 67, 0.95);
        line-height: 20px;
        margin-bottom: 4px;
      }
      .type {
        .flow,
        .screen {
          display: flex;
          width: 361px;
          height: 77px;
          background: #ffffff;
          border-radius: 3px;
          border: 1px solid rgba(24, 31, 67, 0.12);
          margin-bottom: 12px;
          cursor: pointer;
          .image {
            flex: 0 0 64px;
            margin: 8px 12px;
          }
          .text {
            flex: 1;
            .title {
              height: 24px;
              font-size: 16px;
              font-weight: bold;
              color: rgba(0, 0, 0, 0.85);
              line-height: 24px;
              margin-top: 15px;
            }
            .desc {
              height: 20px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(24, 31, 67, 0.5);
              line-height: 20px;
              margin-top: 4px;
            }
          }
        }
        .flow {
          cursor: pointer;
          border: 1px solid rgba(24, 31, 67, 0.12);
          &:hover {
            border: 1px solid rgba(24, 31, 67, 0.5);
          }
          &.active {
            border: 1px solid rgba(24, 31, 67, 0.5);
          }
        }
        .screen {
          cursor: pointer;
          border: 1px solid rgba(24, 31, 67, 0.12);
          &:hover {
            border: 1px solid rgba(24, 31, 67, 0.5);
          }
          &.active {
            border: 1px solid rgba(24, 31, 67, 0.5);
          }
        }
      }
      &.mt24 {
        margin-top: 24px;
      }
    }
  }
  .model_footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    .cancel {
      margin-right: 12px;
    }
  }
`;

const typeMap: { [k in string]: number } = {
  flow: SubAppTypeEnum.FLOW,
  screen: SubAppTypeEnum.SCREEN,
};

const AppModel: FC<{
  type: 'create' | 'edit';
  position: 'left' | 'right';
  name?: string;
  className?: string;
  onClose: () => void;
  onOk: (name: string, type: number) => void;
}> = ({ type, position, name, className, onClose, onOk }) => {
  const [form] = Form.useForm();
  const [appName, setAppName] = useState<string>(name || '');
  const [selectedType, setSelectedType] = useState<'flow' | 'screen'>();
  const containerStyle = useMemo(() => {
    if (position === 'left') {
      return { left: 0 };
    }
    return { right: 0 };
  }, [position]);
  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);
  const handleOK = useCallback(() => {
    form.validateFields().then(() => {
      const type = selectedType ? typeMap[selectedType] : SubAppTypeEnum.FLOW;
      onOk && onOk(appName, type);
    });
  }, [onOk, appName, form, selectedType]);

  return (
    <Container
      className={classNames(className, 'app-modal')}
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="header">
        <div className="title">{type === 'create' ? '新建' : '编辑'}子应用</div>
        <div className="close" onClick={handleClose}>
          <Icon type="guanbi" className="icon" />
        </div>
      </div>
      <div className="content">
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="子应用名称"
            name="subAppName"
            required
            initialValue={appName}
            rules={[
              { required: true, message: '请输入子应用名称' },
              {
                pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,20}$/,
                message: '子应用名称应为3-20位汉字、字母、数字或下划线',
              },
            ]}
          >
            <Input
              autoFocus
              size="large"
              placeholder="请输入"
              onChange={(e) => {
                setAppName(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
        {type === 'create' && (
          <div className="form-item mt24">
            <div className="label">子应用类型</div>
            <div className="type">
              <div
                className={classNames('flow', selectedType === 'flow' ? 'active' : '')}
                onClick={() => {
                  setSelectedType('flow');
                }}
              >
                <img src={FlowImage} alt="FlowImage" className="image" />
                <div className="text">
                  <div className="title">新建流程子应用</div>
                  <div className="desc">可配置表单、流程、列表</div>
                </div>
              </div>
              <div 
                className={classNames('screen', selectedType === 'screen' ? 'active' : '')}
                onClick={() => {
                  setSelectedType('screen');
                }}
              >
                <img src={ScreenImage} alt="ScreenImage" className="image" />
                <div className="text">
                  <div className="title">新建大屏子应用</div>
                  <div className="desc">用于配置可视化大屏及其所需的数据、接口</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="model_footer">
        <div className="operation">
          <Button type="text" size="large" className="cancel" onClick={handleClose}>
            取消
          </Button>
          <Button type="primary" size="large" onClick={handleOK}>
            确定
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default memo(AppModel);
