import {memo, useCallback, useState, useEffect, Fragment} from 'react';
import {Select, Input, Form, Button} from 'antd';
import {axios} from '@utils';
import {ColumnsItem, OptionItem, OptionSource, SelectColumnsItem} from '@/type';
import {Icon} from '@common/components';
import {useAppSelector} from '@/app/hooks';
import {subAppSelector} from '@/features/bpm-editor/form-design/formzone-reducer';
import styles from './index.module.scss';
import classNames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import DraggableOption from "./drag-component";

const {Option} = Select;

interface editProps {
  id?: string;
  value?: SelectColumnsItem;
  onChange?: (v: SelectColumnsItem) => void;
}

const SelectColumns = (props: editProps) => {
  console.log(props, 'flowData')
  const {id, value, onChange} = props;
  const {appId, id: subAppId} = useAppSelector(subAppSelector);
  const [type, setType] = useState<OptionSource>(value?.type || 'fromData');
  const [formList, setFormList] = useState<(OptionItem & { versionId: number })[]>([]);
  const [formKey, setFormKey] = useState<string>(value?.formKeyId || '');
  const [fieldList, setFieldList] = useState<OptionItem[]>([]);
  const [fieldKey, setFieldKey] = useState(value?.fieldName);
  const [columns, setColumns] = useState<ColumnsItem[]>(value?.columns || []);
  const [addDisable, setAddDisable] = useState(false);

  // 新增列
  const addItem = useCallback(() => {
    const list: ColumnsItem[] = [...columns];
    const filterItem = fieldKey?.find((item) => !list.find(cur => cur.key === item));
    if (!filterItem) return
    list.push({title: '', dataIndex: filterItem, key: filterItem})
    setColumns(list);
    setAddDisable(!filterItem)
    onChange && onChange({
      type: 'fromData', formKeyId: formKey, fieldName: fieldKey, columns: list
    });
  }, [columns, onChange]);

  // 删除列
  const deleteItem = useMemoCallback((index) => {
    const list: ColumnsItem[] = [...columns];
    list.splice(index, 1);
    setColumns(list);
    setAddDisable(false)
    onChange && onChange({type: 'fromData', formKeyId: formKey, fieldName: fieldKey, columns: list});
  });

  // 拖拽列
  const handleDrag = useMemoCallback((sourceIndex: number, targetIndex: number) => {
    const list = [...columns];
    let tmp = list[sourceIndex];
    list[sourceIndex] = list[targetIndex];
    list[targetIndex] = tmp;
    setColumns(list);
    onChange && onChange({type: 'fromData', formKeyId: formKey, fieldName: fieldKey, columns: list});
  });

  // 修改表头对应的字段和字段名称
  const handleChangeColumn = useMemoCallback((type: string, value: string, index: number) => {
    const list = [...columns]
    if (type === 'select') {
      list[index] = {
        title: list[index].title,
        dataIndex: value,
        key: value,
      }
    } else if (type === 'blur') {
      list[index] = {
        title: value,
        dataIndex: list[index].dataIndex,
        key: list[index].key,
      }
    }
    setColumns(list)
    onChange && onChange({type: 'fromData', formKeyId: formKey, fieldName: fieldKey, columns: list});
  });

  const fetchFieldNames = useCallback((formList, selectedKey: string) => {
    // todo 
    // let versionId: number = 0;
    // for (let i = 0, len = formList.length; i < len; i++) {
    //   if (formList[i].key === selectedKey) {
    //     versionId = formList[i].versionId;
    //     break;
    //   }
    // }
    // if (versionId) {
    //   axios
    //     .get(`/form/version/${versionId}/components`)
    //     .then((res) => {
    //       const list = res.data
    //         .filter((item: { unique: boolean }) => item.unique)
    //         .map((item: { field: string; name: string }) => ({key: item.field, value: item.name}));
    //       setFieldList(list);
    //     })
    //     .catch(() => {
    //       setFieldList([]);
    //     });
    // }
    setFieldList([
      {key: 'key1', value: '字段1'},
      {key: 'key2', value: '字段2'},
      {key: 'key3', value: '字段3'},
    ])
  }, []);

  // 切换接口
  const handleChangeApi = useCallback(
    (e) => {
      setFormKey(e as string);
      setFieldKey([]);
      setColumns([])
      fetchFieldNames(formList, e);
    },
    [formList, fetchFieldNames],
  );

  // 切换接口下对应的字段
  const handleChangeField = useMemoCallback((e) => {
    setFieldKey(e);
    const list: ColumnsItem[] = [...columns];
    if (!columns.every(item => e.includes(item.key))) {
      const index = list.findIndex(item => !e.includes(item.key))
      list.splice(index, 1);
      setColumns(list);
    }
    onChange && onChange({type, formKeyId: formKey, fieldName: e, columns: list});
  });

  // 切换数据来源
  const handleChangeType = useMemoCallback((type: OptionSource) => {
    setType(type);
    if (type === 'custom' && columns.length > 0) {
      // todo
      // onChange && onChange({type, columns: content});
    } else if (type === 'fromData' && formKey && fieldKey) {
      onChange && onChange({type, formKeyId: formKey, fieldName: fieldKey, columns});
    }
  });

  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <Input/>
      );
    } else if (type === 'fromData') {
      return (
        <>
          <Select
            placeholder="选择接口"
            className={styles.dict_content}
            size="large"
            suffixIcon={<Icon type="xiala"/>}
            onChange={handleChangeApi}
            {...(formKey ? {defaultValue: formKey} : null)}
          >
            {formList.map(({key, value}) => (
              <Option value={key} key={key}>
                {value}
              </Option>
            ))}
          </Select>
          {formKey && (
            <Select
              placeholder="选择字段"
              mode="multiple"
              className={styles.dict_content}
              size="large"
              suffixIcon={<Icon type="xiala"/>}
              value={fieldKey}
              onChange={handleChangeField}
            >
              {fieldList.map(({key, value}) => (
                <Option value={key} key={key}>
                  {value}
                </Option>
              ))}
            </Select>
          )}
          {fieldKey &&
          <div>
            <Form.Item className={styles.form} name="columns" label="自定义表头字段">
              <div className={styles.custom_list}>
                {columns?.map((item, index: number) => (
                  <Fragment key={item.key}>
                    <DraggableOption
                      index={index}
                      data={item}
                      columns={fieldKey}
                      onChange={handleChangeColumn}
                      onDrag={handleDrag}
                      onDelete={deleteItem}
                    />
                  </Fragment>
                ))}
                <Button className={styles.add_custom} onClick={addItem} disabled={addDisable}>
                  <Icon className={styles.iconfont} type="xinzengjiacu"/>
                  <span>添加表头</span>
                </Button>
              </div>
            </Form.Item>
          </div>
          }
        </>
      );
    }
    return null;
  });

  useEffect(() => {
    if (type === 'fromData') {
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
          setFormList(list);
          return Promise.resolve(list);
        })
        .then((list) => {
          fetchFieldNames(list, formKey);
        });
    }
  }, [appId, subAppId, type, formKey, fetchFieldNames]);

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
          className={classNames(styles.subapp, type === 'fromData' ? styles.active : '')}
          onClick={() => {
            handleChangeType('fromData');
          }}
        >
          从XXX获取数据
        </div>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default memo(SelectColumns);