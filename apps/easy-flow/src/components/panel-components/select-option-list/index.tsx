import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Select, Input, Tooltip } from 'antd';
import { uniqueId } from 'lodash';

const { Option } = Select;

const Container = styled.div`
  .title {
    display: flex;
    height: 40px;
    line-height: 40px;
    background: rgba(24, 39, 67, 0.04);
    border-radius: 3px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(24, 31, 67, 0.95);
    > div {
      flex: 1;
      text-align: center;
      cursor: pointer;
    }
    .active {
      background: #ffffff;
      border-radius: 3px 0px 0px 3px;
      border: 1px solid rgba(24, 31, 67, 0.12);
      font-weight: 500;
      color: #4c5cdb;
    }
  }
  .custom_list {
    padding: 12px 0;
    .custom_item {
      position: relative;
      height: 40px;
      line-height: 40px;
      background: rgba(24, 39, 67, 0.04);
      border-radius: 3px;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(24, 31, 67, 0.95);
      .delete,
      .move {
        position: absolute;
        top: 0;
        z-index: 10;
        width: 28px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        .iconfont {
          color: #818a9e;
        }
      }
      .move {
        right: 0;
        .iconfont {
          cursor: move;
        }
      }
      .delete {
        right: 29px;
        border-right: 1px solid rgba(24, 31, 67, 0.12);
        .iconfont {
          cursor: pointer;
        }
      }
    }
    .add_custom {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid rgba(24, 31, 67, 0.12);
      font-size: 14px;
      font-weight: 400;
      color: rgba(24, 31, 67, 0.95);
      cursor: pointer;
      .iconfont {
        font-size: 14px;
        margin-right: 4px;
      }
    }
  }
  .dict_content {
    padding: 12px 0;
  }
`;
type Mode = 'custom' | 'dictionaries';
type optionItem = {
  key: string;
  value: string;
};
type selectedItem = string;
type Value = {
  type: Mode;
  content: optionItem[];
};
interface editProps {
  value?: Value;
  onChange?: (v: Value) => void;
}

const SelectOptionList = (props: editProps) => {
  const { value, onChange } = props;
  const [type, setType] = useState<Mode>(value?.type || 'custom');
  const [content, setContent] = useState<optionItem[]>(value?.content || []);
  const [canDrag, setCanDrag] = useState<boolean>(false);
  const customRef = useRef(null);
  useEffect(() => {
    if (value) {
      setType(value.type);
      setContent(value.content);
    }
  }, [value]);
  const addItem = useCallback(() => {
    const list: optionItem[] = [...content];
    const name = uniqueId('未命名');
    list.push({ key: name, value: name });
    setContent(list);
  }, [content]);
  const deleteItem = useCallback(
    (index) => {
      const list: optionItem[] = [...content];
      list.splice(index, 1);
      setContent(list);
    },
    [content],
  );
  // TODO 拖拽交换顺序暂未实现
  const handleDragstart = useCallback((e) => {
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHtml);
  }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);
  useEffect(() => {
    // onChange && onChange({ type, content });
  }, [type, content, onChange]);
  const customContent = useMemo(() => {
    if (Array.isArray(content)) {
      return (
        <div className="custom_list" ref={customRef} onDrop={handleDrop} onDragOver={handleDragOver}>
          {content.map((item: optionItem, index: number) => (
            <div className="custom_item" key={item.key} draggable={canDrag} onDragStart={handleDragstart}>
              <div
                className="delete"
                onClick={() => {
                  deleteItem(index);
                }}
              >
                <Tooltip title="删除">
                  <span className="iconfont iconshanchu"></span>
                </Tooltip>
              </div>
              <div
                className="move"
                onMouseEnter={() => {
                  setCanDrag(true);
                }}
                onMouseLeave={() => {
                  setCanDrag(false);
                }}
              >
                <Tooltip title="拖动换行">
                  <span className="iconfont iconcaidan"></span>
                </Tooltip>
              </div>
              <Input size="large" defaultValue={item.value} />
            </div>
          ))}
          <div className="add_custom" onClick={addItem}>
            <span className="iconfont iconxinzengjiacu"></span>
            <span>添加选项</span>
          </div>
        </div>
      );
    }
    return null;
  }, [content, canDrag]);
  const dictContent = useMemo(() => {
    if (type === 'dictionaries') {
      return (
        <Select placeholder="请选择" className="dict_content" size="large">
          <Option value="1">字典一</Option>
          <Option value="2">字典二</Option>
        </Select>
      );
    }
    return null;
  }, [type]);
  return (
    <Container>
      <div className="title">
        <div
          className={`left ${type === 'custom' ? 'active' : ''}`}
          onClick={() => {
            setType('custom');
          }}
        >
          自定义数据
        </div>
        <div
          className={`right ${type === 'dictionaries' ? 'active' : ''}`}
          onClick={() => {
            setType('dictionaries');
          }}
        >
          字典数据
        </div>
      </div>
      <div className="content">{type === 'custom' ? customContent : dictContent}</div>
    </Container>
  );
};

export default memo(SelectOptionList);
