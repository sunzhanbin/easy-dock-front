import { FormField, TConfigItem } from '@/type';
import React, { memo, FC, useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';

const BoxContainer = styled.div`
  position:relative;
  cursor: move;
  div{
    &:first-child{
        pointer-events:none;
    }
  }
  &:hover{
    .operation{
        display:flex;
    }
  }
  .operation{
    position: absolute;
    top: -5px;
    right: 12px;
    display:none;
    width: 60px;
    height: 24px;
    padding: 0 4px;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    box-shadow: 0 0 4px 0 rgb(43 52 65 / 10%);
    border-radius: 14px;
    .iconfont{
        font-size: 14px;
        color: #aaaeb3;
        cursor: pointer;
    }
  }
`;

const SourceBox: FC<{ type: string, config: FormField }> = ({ type, config }) => {
    const [Component, setComponent] = useState<FC | null>(null);
    useEffect(() => {
        import(`../basic-shop/basic-components/${type}/index`).then(res => {
            setComponent(res.default);
        })
    }, []);
    const handleCopy = useCallback(() => {
        console.log('复制成功!')
    }, []);
    const handleDelete = useCallback(() => {
        console.log('删除成功!')
    }, []);
    const content = useMemo(() => {
        if (Component) {
            return (
                <BoxContainer>
                    <Component {...(config as TConfigItem)} />
                    <div className="operation">
                        <span className="iconfont icon-Copyingx" onClick={handleCopy} ></span>
                        <span className="iconfont icon-template_delete-copy" onClick={handleDelete} ></span>
                    </div>
                </BoxContainer>
            )
        }
        return null;
    }, [Component, config])
    return (<>{content}</>)
}

export default memo(SourceBox);