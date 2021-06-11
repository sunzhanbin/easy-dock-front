import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { InputNumber } from 'antd';
import { Icon } from '@common/components';
import { InputNumberProps } from 'antd/lib/input-number';

const TextareaComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  .number_container {
    position: relative;
    .icon {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 40px;
      height: 40px;
      .iconfont {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 16px;
        text-align: center;
        margin: 12px;
      }
    }
    .ant-input-number {
      width: 100%;
      .ant-input-number-input {
        padding-left: 40px;
      }
    }
  }
`;

const TextareaComponent = (props: InputNumberProps) => {
  const location = useLocation();
  const { defaultValue, readOnly, onChange } = props;
  const propList = useMemo(() => {
    const prop: { [k: string]: string | number | boolean | undefined | Function } = {
      size: 'large',
      placeholder: '请输入',
      readOnly: readOnly,
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue;
      if (location.pathname === '/form-design') {
        prop.value = defaultValue;
      }
    }
    return Object.assign({}, props, prop);
  }, [defaultValue, readOnly, location, props, onChange]);

  return (
    <TextareaComponentContainer>
      <div className="number_container">
        <div className="icon">
          <Icon className="iconfont" type="shuzi123" />
        </div>
        <InputNumber {...propList} />
      </div>
    </TextareaComponentContainer>
  );
};

export default memo(TextareaComponent);
