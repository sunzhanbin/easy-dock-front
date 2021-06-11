import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Select, Input, Tooltip } from 'antd';
import { uniqueId } from 'lodash';
import { axios } from '@utils';
import { OptionItem, OptionMode, SelectOptionItem } from '@/type';
import { Icon } from '@common/components';
import { useAppSelector } from '@/app/hooks';
import { subAppSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

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
interface editProps {
  value?: SelectOptionItem;
  onChange?: (v: SelectOptionItem) => void;
}

type NameMap = {
  [k: string]: OptionItem[];
};

const SelectOptionList = (props: editProps) => {
  const { value, onChange } = props;
  const { appId, id: subAppId } = useAppSelector(subAppSelector);
  const [type, setType] = useState<OptionMode>(value?.type || 'custom');
  const [content, setContent] = useState<OptionItem[]>(value?.data || []);
  const [canDrag, setCanDrag] = useState<boolean>(false);
  const [subAppKey, setSubAppKey] = useState<string>('');
  const [appList, setAppList] = useState<OptionItem[]>([]);
  const [componentKey, setComponentKey] = useState<string>('');
  const [componentList, setComponentList] = useState<OptionItem[]>([]);
  const addItem = useCallback(() => {
    const list: OptionItem[] = [...content];
    const name = uniqueId('未命名');
    list.push({ key: name, value: name });
    setContent(list);
  }, [content]);
  const deleteItem = useCallback(
    (index) => {
      const list: OptionItem[] = [...content];
      list.splice(index, 1);
      setContent(list);
    },
    [content],
  );
  const handleDragstart = useCallback((e, index) => {
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('index', index);
  }, []);
  const handleDrop = useCallback(
    (e, index) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      const sourceIndex = +e.dataTransfer.getData('index');
      const targetIndex = index;
      const list: OptionItem[] = [...content];
      if (sourceIndex > targetIndex) {
        list.splice(targetIndex, 0, list[sourceIndex]);
        list.splice(sourceIndex + 1, 1);
      } else {
        const target = list[sourceIndex];
        list.splice(sourceIndex, 1);
        list.splice(targetIndex, 0, target);
      }
      setContent(list);
    },
    [content],
  );
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleBlur = useCallback(
    (e, index) => {
      const list = [...content];
      const text = e.target.value;
      list[index] = {
        key: text,
        value: text,
      };
      setContent(list);
    },
    [content],
  );
  const handleChangeApp = useCallback((e) => {
    setSubAppKey(e as string);
    setComponentList([]);
    // setComponentList(list);
    setComponentKey('');
  }, []);
  const handleChangeComponent = useCallback((e) => {
    setComponentKey(e);
  }, []);
  useEffect(() => {
    axios.get(`/subapp/${appId}/list/all/deployed`).then((res) => {
      const list = res.data
        .filter((app: { id: number }) => app.id !== subAppId)
        .map((app: { name: string; id: number }) => ({ key: app.id, value: app.name }));
      setAppList(list);
    });
  }, [subAppId]);
  useEffect(() => {
    onChange && onChange({ type, data: content });
  }, [type, content]);
  const customContent = useMemo(() => {
    if (Array.isArray(content) && type === 'custom') {
      return (
        <div className="custom_list">
          {content.map((item: OptionItem, index: number) => (
            <div
              className="custom_item"
              key={item.key}
              draggable={canDrag}
              onDragStart={(e) => {
                handleDragstart(e, index);
              }}
              onDrop={(e) => {
                handleDrop(e, index);
              }}
              onDragOver={handleDragOver}
            >
              <div
                className="delete"
                onClick={() => {
                  deleteItem(index);
                }}
              >
                <Tooltip title="删除">
                  <Icon className="iconfont" type="shanchu" />
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
                  <Icon className="iconfont" type="caidan" />
                </Tooltip>
              </div>
              <Input
                size="large"
                defaultValue={item.value}
                onBlur={(e) => {
                  handleBlur(e, index);
                }}
              />
            </div>
          ))}
          <div className="add_custom" onClick={addItem}>
            <Icon className="iconfont" type="xinzengjiacu" />
            <span>添加选项</span>
          </div>
        </div>
      );
    }
    return null;
  }, [type, content, canDrag, addItem, deleteItem, handleBlur, handleDragOver, handleDragstart, handleDrop]);
  const dictContent = useMemo(() => {
    if (type === 'dictionaries') {
      return (
        <>
          <Select placeholder="选择子应用" className="dict_content" size="large" onChange={handleChangeApp}>
            {appList.map(({ key, value }) => (
              <Option value={key} key={key}>
                {value}
              </Option>
            ))}
          </Select>
          {subAppKey && (
            <Select
              placeholder="选择控件"
              className="dict_content"
              size="large"
              {...(componentKey ? { value: componentKey } : null)}
              onChange={handleChangeComponent}
            >
              {componentList.map(({ key, value }) => (
                <Option value={key} key={key}>
                  {value}
                </Option>
              ))}
            </Select>
          )}
        </>
      );
    }
    return null;
  }, [type, subAppKey, componentKey, appList, componentList, handleChangeApp, handleChangeComponent]);
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
          其他表单数据
        </div>
      </div>
      <div className="content">{type === 'custom' ? customContent : dictContent}</div>
    </Container>
  );
};

export default memo(SelectOptionList);
