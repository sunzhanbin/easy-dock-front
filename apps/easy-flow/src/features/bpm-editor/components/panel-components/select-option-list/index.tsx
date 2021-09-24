import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { Select, Input, Tooltip, Form } from 'antd';
import { axios } from '@utils';
import { FormField, OptionItem, OptionMode, SelectOptionItem } from '@/type';
import { Icon } from '@common/components';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector, subAppSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import styles from './index.module.scss';
import classNames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import DataApiConfig from '@/features/bpm-editor/components/data-api-config';
import ResponseNoMap from '@/features/bpm-editor/components/data-api-config/response-no-map';

const { Option } = Select;
interface editProps {
  id?: string;
  value?: SelectOptionItem;
  onChange?: (v: SelectOptionItem) => void;
}

const SelectOptionList = (props: editProps) => {
  const { id, value, onChange } = props;
  const { appId, id: subAppId } = useAppSelector(subAppSelector);
  const byId = useAppSelector(componentPropsSelector);
  const [type, setType] = useState<OptionMode>(value?.type || 'custom');
  const [content, setContent] = useState<OptionItem[]>(value?.data || []);
  const [canDrag, setCanDrag] = useState<boolean>(false);
  const [subAppKey, setSubAppKey] = useState<string>(value?.subappId || '');
  const [appList, setAppList] = useState<(OptionItem & { versionId: number })[]>([]);
  const [componentKey, setComponentKey] = useState<string | undefined>(value?.fieldName);
  const [componentList, setComponentList] = useState<OptionItem[]>([]);

  const fields = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => com.type !== 'DescText' && com.id !== id)
      .map((com) => ({ id: com.fieldName, name: com.label }));
  }, [byId, id]);

  const addItem = useCallback(() => {
    const list: OptionItem[] = [...content];
    const filterList = list.filter((item: OptionItem) => item.key.startsWith('未命名'));
    let maxIndex = 1;
    if (filterList.length > 0) {
      const indexList = filterList.map((item) => +item.key.slice(3));
      maxIndex = Math.max(...indexList) + 1;
    }
    const name = `未命名${maxIndex}`;
    list.push({ key: name, value: name });
    setContent(list);
    onChange && onChange({ type: 'custom', data: list });
  }, [content, onChange]);
  const deleteItem = useMemoCallback((index) => {
    const list: OptionItem[] = [...content];
    list.splice(index, 1);
    setContent(list);
    onChange && onChange({ type: 'custom', data: list });
  });
  const handleDragstart = useCallback((e, index) => {
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('index', index);
  }, []);
  const handleDrop = useMemoCallback((e, index) => {
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
    onChange && onChange({ type: 'custom', data: list });
  });
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleBlur = useMemoCallback((e, index) => {
    const list = [...content];
    const text = e.target.value;
    list[index] = {
      key: text,
      value: text,
    };
    setContent(list);
    onChange && onChange({ type: 'custom', data: list });
  });
  const fetchFieldNames = useCallback((appList, selectedKey: string) => {
    let versionId: number = 0;
    for (let i = 0, len = appList.length; i < len; i++) {
      if (appList[i].key === selectedKey) {
        versionId = appList[i].versionId;
        break;
      }
    }
    if (versionId) {
      axios
        .get(`/form/version/${versionId}/components`)
        .then((res) => {
          const list = res.data
            .filter((item: { unique: boolean }) => item.unique)
            .map((item: { field: string; name: string }) => ({ key: item.field, value: item.name }));
          setComponentList(list);
        })
        .catch(() => {
          setComponentList([]);
        });
    }
  }, []);
  const handleChangeApp = useCallback(
    (e) => {
      setSubAppKey(e as string);
      setComponentKey(undefined);
      fetchFieldNames(appList, e);
    },
    [appList, fetchFieldNames],
  );
  const handleChangeComponent = useMemoCallback((e) => {
    setComponentKey(e);
    onChange && onChange({ type, subappId: subAppKey, fieldName: e });
  });

  const handleChangeType = useMemoCallback((type: OptionMode) => {
    setType(type);
    if (type === 'custom' && content.length > 0) {
      onChange && onChange({ type, data: content });
    } else if (type === 'subapp' && subAppKey && componentKey) {
      onChange && onChange({ type, subappId: subAppKey, fieldName: componentKey });
    } else if (type === 'interface') {
      onChange && onChange({ type, apiconfig: value?.apiconfig });
    }
  });

  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <div className={styles.custom_list}>
          {content.map((item: OptionItem, index: number) => (
            <div
              className={styles.custom_item}
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
                className={styles.delete}
                onClick={() => {
                  deleteItem(index);
                }}
              >
                <Tooltip title="删除">
                  <span>
                    <Icon className={styles.iconfont} type="shanchu" />
                  </span>
                </Tooltip>
              </div>
              <div
                className={styles.move}
                onMouseEnter={() => {
                  setCanDrag(true);
                }}
                onMouseLeave={() => {
                  setCanDrag(false);
                }}
              >
                <Tooltip title="拖动换行">
                  <span>
                    <Icon className={styles.iconfont} type="caidan" />
                  </span>
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
          <div className={styles.add_custom} onClick={addItem}>
            <Icon className={styles.iconfont} type="xinzengjiacu" />
            <span>添加选项</span>
          </div>
        </div>
      );
    } else if (type === 'subapp') {
      return (
        <>
          <Select
            placeholder="选择子应用"
            className={styles.dict_content}
            size="large"
            suffixIcon={<Icon type="xiala" />}
            onChange={handleChangeApp}
            {...(subAppKey ? { defaultValue: subAppKey } : null)}
          >
            {appList.map(({ key, value }) => (
              <Option value={key} key={key}>
                {value}
              </Option>
            ))}
          </Select>
          {subAppKey && (
            <Select
              placeholder="选择控件"
              className={styles.dict_content}
              size="large"
              suffixIcon={<Icon type="xiala" />}
              value={componentKey}
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
    } else if (type === 'interface') {
      return (
        <Form.Item className={styles.form} name="apiconfig" label="选择要读取数据的接口">
          <DataApiConfig name="apiconfig" label="为表单控件匹配请求参数" layout="vertical" fields={fields}>
            <ResponseNoMap label="选择返回参数" />
          </DataApiConfig>
        </Form.Item>
      );
    }

    return null;
  });

  useEffect(() => {
    if (type === 'subapp') {
      axios
        .get(`/subapp/${appId}/list/all/deployed`)
        .then((res) => {
          const list = res.data
            .filter((app: { id: number }) => app.id !== subAppId)
            .map((app: { name: string; id: number; version: { id: number } }) => ({
              key: app.id,
              value: app.name,
              versionId: app.version.id,
            }));
          setAppList(list);
          return Promise.resolve(list);
        })
        .then((list) => {
          fetchFieldNames(list, subAppKey);
        });
    }
  }, [appId, subAppId, type, subAppKey, fetchFieldNames]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div
          className={classNames(styles.custom, type === 'custom' ? styles.active : '')}
          onClick={() => {
            handleChangeType('custom');
          }}
        >
          自定义数据
        </div>
        <div
          className={classNames(styles.subapp, type === 'subapp' ? styles.active : '')}
          onClick={() => {
            handleChangeType('subapp');
          }}
        >
          其他表单数据
        </div>
        <div
          className={classNames(styles.interface, type === 'interface' ? styles.active : '')}
          onClick={() => {
            handleChangeType('interface');
          }}
        >
          接口数据
        </div>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default memo(SelectOptionList);
