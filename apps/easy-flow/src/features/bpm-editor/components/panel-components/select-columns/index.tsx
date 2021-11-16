import { memo, useCallback, useState, useEffect, Fragment } from 'react';
import { Select, Form, Button } from 'antd';
import { axios } from '@utils';
import { ColumnsItem, LabelMap, OptionItem, SelectColumnsItem } from '@/type';
import { Icon } from '@common/components';
import { useAppSelector } from '@/app/hooks';
import { subAppSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import styles from './index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';
import DraggableOption from './drag-component';

const { Option } = Select;

interface editProps {
  id?: string;
  value?: SelectColumnsItem;
  onChange?: (v: SelectColumnsItem) => void;
}

const SelectColumns = (props: editProps) => {
  const { id, value, onChange } = props;
  const { appId, id: subAppId } = useAppSelector(subAppSelector);
  const [formList, setFormList] = useState<(OptionItem & { versionId: number })[]>([]);
  const [formKey, setFormKey] = useState<string>(value?.formKeyId || '');
  const [fieldList, setFieldList] = useState<LabelMap[]>([]);
  const [columns, setColumns] = useState<ColumnsItem[]>(value?.columns || []);
  const [addDisable, setAddDisable] = useState(false);

  // 新增列
  const addItem = useCallback(() => {
    const list: ColumnsItem[] = [...columns];
    list.push({ title: '', dataIndex: '', key: new Date().getTime() + '' });
    setColumns(list);
    onChange &&
      onChange({
        id,
        formKeyId: formKey,
        columns: list,
      });
    if (list.length === fieldList.length) {
      setAddDisable(true);
    }
  }, [columns, fieldList.length, formKey, id, onChange]);

  // 删除列
  const deleteItem = useMemoCallback((index) => {
    const list: ColumnsItem[] = [...columns];
    list.splice(index, 1);
    setColumns(list);
    setAddDisable(false);
    onChange && onChange({ id, formKeyId: formKey, columns: list });
  });

  // 拖拽列
  const handleDrag = useMemoCallback((sourceIndex: number, targetIndex: number) => {
    const list = [...columns];
    let tmp = list[sourceIndex];
    list[sourceIndex] = list[targetIndex];
    list[targetIndex] = tmp;
    setColumns(list);
    onChange && onChange({ id, formKeyId: formKey, columns: list });
  });

  // 修改表头对应的字段和字段名称
  const handleChangeColumn = useMemoCallback((type: string, value: { key: string; label: string }, index: number) => {
    const list = [...columns];
    if (type === 'select') {
      list[index] = {
        title: value?.label,
        dataIndex: value?.key,
        key: value.key,
      };
    } else if (type === 'blur') {
      // list[index] = {
      //   title: value,
      //   dataIndex: list[index].dataIndex,
      //   key: list[index].key,
      // }
    }
    setColumns(list);
    onChange && onChange({ id, formKeyId: formKey, columns: list });
  });

  const fetchFieldNames = useCallback((formList, selectedKey: string) => {
    setFieldList([
      { key: 'key1', value: 'key1', label: '字段1' },
      { key: 'key2', value: 'key2', label: '字段2' },
      { key: 'key3', value: 'key3', label: '字段3' },
    ]);
  }, []);

  // 切换接口
  const handleChangeApi = useMemoCallback((selectedKey: string) => {
    setFormKey(selectedKey);
    setColumns([]);
    fetchFieldNames(formList, selectedKey);
    onChange && onChange({ id, formKeyId: selectedKey, columns: [] });
  });

  const renderContent = useMemoCallback(() => {
    return (
      <>
        <Select
          placeholder="选择流程类型"
          className={styles.dict_content}
          size="large"
          suffixIcon={<Icon type="xiala" />}
          onChange={handleChangeApi}
          {...(formKey ? { defaultValue: formKey } : null)}
        >
          {formList.map(({ key, value }) => (
            <Option value={key} key={key}>
              {value}
            </Option>
          ))}
        </Select>
        {formKey && (
          <div>
            <Form.Item className={styles.form} name="columns" label="显示字段">
              <div className={styles.custom_list}>
                {columns?.map((item, index: number) => (
                  <Fragment key={item.key}>
                    <DraggableOption
                      index={index}
                      data={item}
                      columns={columns}
                      fieldList={fieldList}
                      onChange={handleChangeColumn}
                      onDrag={handleDrag}
                      onDelete={deleteItem}
                    />
                  </Fragment>
                ))}
                <Button className={styles.add_custom} onClick={addItem} disabled={addDisable}>
                  <Icon className={styles.iconfont} type="xinzengjiacu" />
                  <span>添加表头</span>
                </Button>
              </div>
            </Form.Item>
          </div>
        )}
      </>
    );
  });

  useEffect(() => {
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
  }, [appId, subAppId, formKey, fetchFieldNames]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default memo(SelectColumns);
