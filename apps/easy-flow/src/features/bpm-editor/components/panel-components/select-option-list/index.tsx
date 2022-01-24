import { memo, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Select, Input, Tooltip, Form } from "antd";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import { axios } from "@utils";
import { FormField, OptionItem, OptionMode, SelectOptionItem } from "@/type";
import { Icon } from "@common/components";
import { useAppSelector } from "@/app/hooks";
import { dataSource } from "@/config/components";
import { componentPropsSelector, subAppSelector } from "@/features/bpm-editor/form-design/formzone-reducer";
import styles from "./index.module.scss";
import classNames from "classnames";
import useMemoCallback from "@common/hooks/use-memo-callback";
import DataApiConfig from "@/features/bpm-editor/components/data-api-config";
import ResponseNoMap from "@/features/bpm-editor/components/data-api-config/response-no-map";
import { DataConfig } from "@/type/api";

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
  const [type, setType] = useState<OptionMode>(value?.type || "custom");
  const [content, setContent] = useState<OptionItem[]>(value?.data || dataSource.defaultValue.data);
  const [subAppKey, setSubAppKey] = useState<string>(value?.subappId || "");
  const [appList, setAppList] = useState<(OptionItem & { versionId: number })[]>([]);
  const [componentKey, setComponentKey] = useState<string | undefined>(value?.fieldName);
  const [componentList, setComponentList] = useState<OptionItem[]>([]);
  const [cacheApiConfig, setCacheApiConfig] = useState<DataConfig>();

  const fields = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => !["DescText", "Tabs"].includes(com.type) && com.id !== id)
      .map((com) => ({ id: com.fieldName, name: com.label }));
  }, [byId, id]);

  const addItem = useCallback(() => {
    const list: OptionItem[] = [...content];
    const filterList = list.filter((item: OptionItem) => item.key.startsWith("选项"));
    let maxIndex = 1;
    if (filterList.length > 0) {
      const indexList = filterList.map((item) => +item.key.slice(2));
      maxIndex = Math.max(...indexList) + 1;
    }
    const name = `选项${maxIndex}`;
    list.push({ key: name, value: name });
    setContent(list);
    onChange && onChange({ type: "custom", data: list });
  }, [content, onChange]);
  const deleteItem = useMemoCallback((index) => {
    const list: OptionItem[] = [...content];
    list.splice(index, 1);
    setContent(list);
    onChange && onChange({ type: "custom", data: list });
  });

  const handleDrop = useMemoCallback((sourceIndex: number, targetIndex: number) => {
    const list: OptionItem[] = [...content];

    const tmp = list[sourceIndex];

    list[sourceIndex] = list[targetIndex];
    list[targetIndex] = tmp;

    setContent(list);
    onChange && onChange({ type: "custom", data: list });
  });

  const handleBlur = useMemoCallback((value: string, index: number) => {
    const list = [...content];
    list[index] = {
      key: value,
      value: value,
    };
    setContent(list);
    onChange && onChange({ type: "custom", data: list });
  });
  const fetchFieldNames = useCallback((appList, selectedKey: string) => {
    let versionId = 0;
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

    if (type === "custom" && content.length > 0) {
      onChange && onChange({ type, data: content });
    } else if (type === "subapp" && subAppKey && componentKey) {
      onChange && onChange({ type, subappId: subAppKey, fieldName: componentKey });
    } else if (type === "interface") {
      let apiConfig: DataConfig = { type: 1, request: { required: [], customize: [] } };
      if (cacheApiConfig) {
        apiConfig = Object.assign({}, apiConfig, value?.apiConfig, cacheApiConfig);
      }
      onChange && onChange({ type, apiConfig });
    }
  });
  const handleApiChange = useMemoCallback((apiConfig) => {
    setCacheApiConfig(apiConfig);
    onChange && onChange({ type, apiConfig });
  });

  const renderContent = useMemoCallback(() => {
    if (type === "custom") {
      return (
        <div className={styles.custom_list}>
          {content.map((item: OptionItem, index: number) => (
            <DragableOption
              key={item.key}
              index={index}
              data={item}
              onChange={handleBlur}
              onDrop={handleDrop}
              onDelete={deleteItem}
            />
          ))}
          <div className={styles.add_custom} onClick={addItem}>
            <Icon className={styles.iconfont} type="xinzengjiacu" />
            <span>添加选项</span>
          </div>
        </div>
      );
    } else if (type === "subapp") {
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
    } else if (type === "interface") {
      return (
        <Form.Item className={styles.form} name={["dataSource", "apiConfig"]} label="选择要读取数据的接口">
          <DataApiConfig
            name={["dataSource", "apiConfig"]}
            label="为表单控件匹配请求参数"
            layout="vertical"
            className={styles.apiConfig}
            fields={fields}
            onChange={handleApiChange}
          >
            <ResponseNoMap label="选择返回参数" />
          </DataApiConfig>
        </Form.Item>
      );
    }

    return null;
  });

  useEffect(() => {
    if (type === "subapp") {
      axios
        .get(`/subapp/${appId}/list/all/deployed`)
        .then((res) => {
          const list = res.data
            .filter((app: { id: number; type: number }) => app.type === 2 && app.id !== subAppId)
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
          className={classNames(styles.custom, type === "custom" ? styles.active : "")}
          onClick={() => {
            handleChangeType("custom");
          }}
        >
          自定义数据
        </div>
        <div
          className={classNames(styles.subapp, type === "subapp" ? styles.active : "")}
          onClick={() => {
            handleChangeType("subapp");
          }}
        >
          其他表单数据
        </div>
        <div
          className={classNames(styles.interface, type === "interface" ? styles.active : "")}
          onClick={() => {
            handleChangeType("interface");
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

interface DragableOptionProps {
  data: OptionItem;
  onDelete(index: this["index"]): void;
  onChange(value: this["data"]["value"], index: this["index"]): void;
  onDrop(sourceIndex: number, targetIndex: number): void;
  index: number;
}

function DragableOption(props: DragableOptionProps) {
  const { onDelete, data, onChange, onDrop, index } = props;
  const dragWrapperRef = useRef<HTMLDivElement>(null);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "option",
      item() {
        return { index };
      },
      canDrag: () => canMove,
      collect(monitor) {
        return { opacity: monitor.isDragging() ? 0.2 : 1 };
      },
    }),
    [index, canMove],
  );
  const [, drop] = useDrop(
    () => ({
      accept: "option",
      hover: (currentDragItem: { index: number }, monitor: DropTargetMonitor) => {
        if (!dragWrapperRef.current) {
          return;
        }
        const dragIndex = currentDragItem.index;
        const hoverIndex = index;
        if (hoverIndex === dragIndex) {
          return;
        }
        const hoverBoundingRect = dragWrapperRef.current?.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
        // Dragging downwards
        if (dragIndex === -1 || (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)) {
          return;
        }

        // Dragging upwards
        if (dragIndex === -1 || (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) {
          return;
        }
        onDrop(dragIndex, hoverIndex);
        currentDragItem.index = hoverIndex;
      },
      drop: (currentDragItem: { index: number }) => {
        return { ...currentDragItem, hoverIndex: index };
      },
    }),
    [onDrop, index],
  );

  const handleInputBlur = useMemoCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onChange(event.target.value, index);
  });

  const handleDelete = useMemoCallback(() => {
    onDelete(index);
  });

  const handleMouseEnter = useMemoCallback(() => {
    setCanMove(true);
  });

  const handleMouseLeave = useMemoCallback(() => {
    setCanMove(false);
  });

  useEffect(() => {
    drag(drop(dragWrapperRef));
  }, [drag, drop]);

  return (
    <div className={styles.custom_item} ref={dragWrapperRef} style={{ opacity }}>
      <div className={styles.delete} onClick={handleDelete}>
        <Tooltip title="删除">
          <span>
            <Icon className={styles.iconfont} type="shanchu" />
          </span>
        </Tooltip>
      </div>
      <div className={styles.move} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Tooltip title="拖动换行">
          <span>
            <Icon className={styles.iconfont} type="caidan" />
          </span>
        </Tooltip>
      </div>
      <Input size="large" defaultValue={data.value} onBlur={handleInputBlur} />
    </div>
  );
}
