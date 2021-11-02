import { memo, useState, useRef, useEffect } from 'react';
import { Tabs as TabList, Modal, Form, Input, FormInstance } from 'antd';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';
import { CompConfig } from '@/type';
import FormList from './form-list';
import { FieldAuthsMap } from '@/type/flow';

const { TabPane } = TabList;
type PaneType = {
  __title__: string; //为了防止用户输入的数据库字段名为title与这个重复，故使用__title__
  content: (key: string) => JSX.Element;
  key: string;
};

interface TabProps {
  fieldName: string;
  auth: FieldAuthsMap;
  formInstance?: FormInstance;
  components?: CompConfig[];
  readonly?: boolean;
  value?: any;
  onChange?: (value: this['value']) => void;
}

const Tabs = ({ components = [], fieldName, auth, formInstance, value, readonly, onChange }: TabProps) => {
  const [form] = Form.useForm();
  const tabRef = useRef<HTMLDivElement>(null);
  const content = useMemoCallback((key: string) => {
    return <FormList fields={components} id={key} parentId={fieldName} auth={auth} readonly={readonly} />;
  });
  const [panes, setPanes] = useState<PaneType[]>([]);
  const [activeKey, setActiveKey] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleAdd = useMemoCallback(() => {
    setShowModal(true);
  });
  const handleRemove = useMemoCallback((key: string) => {
    const list = formInstance?.getFieldsValue()[fieldName] || [...panes];
    const index = list.findIndex((pane: any) => pane.key === key);
    const paneList = list.filter((v: any) => v.key !== key);
    setPanes(paneList);
    onChange && onChange(paneList);
    if (activeKey === list[index].key) {
      index > 0 ? setActiveKey(list[index - 1].key) : setActiveKey(list[0].key);
    }
  });
  const handleEdit = useMemoCallback((targetKey, action) => {
    if (action === 'add') {
      handleAdd();
    } else if (action === 'remove') {
      handleRemove(targetKey);
    }
  });
  const handleClose = useMemoCallback(() => {
    form.setFieldsValue({ __title__: '' });
    setShowModal(false);
  });
  const handleOk = useMemoCallback(() => {
    form.validateFields().then((values) => {
      const { __title__ } = values;
      // 为了解决tabs回显问题,所以使用了formInstance
      const list = formInstance?.getFieldsValue()[fieldName] || [...panes];
      const key = String(list.length);
      list.push({ key, __title__, content });
      setPanes(list);
      onChange && onChange(list);
      setActiveKey(key);
      handleClose();
    });
  });
  const handleChange = useMemoCallback((key) => {
    setActiveKey(key);
  });
  useEffect(() => {
    const list = typeof value === 'string' ? JSON.parse(value) : Array.isArray(value) ? [...value] : [];
    const panes = list.map((pane: any) => {
      if (!pane.content) {
        return { ...pane, content };
      }
      return pane;
    });
    setPanes(panes);
    if (list.length > 0) {
      setActiveKey(list[0].key);
    }
  }, [content]);
  // 编辑态默认有个tab,用于展示编辑的控件
  useEffect(() => {
    const el = document.getElementById('edit-form');
    if (el?.contains(tabRef.current)) {
      setPanes([{ __title__: 'tab', content, key: 'edit' }]);
      setActiveKey('edit');
    }
  }, [tabRef, content]);

  return (
    <div className={styles.tabs} ref={tabRef}>
      <TabList
        type="editable-card"
        activeKey={activeKey}
        addIcon={<Icon type="xinzeng" />}
        onEdit={handleEdit}
        onChange={handleChange}
      >
        {(panes || []).map(({ __title__, key, content }) => {
          return (
            <TabPane tab={__title__} key={key}>
              {typeof content === 'function' && content(key)}
            </TabPane>
          );
        })}
      </TabList>
      <Modal visible={showModal} title="标题" closable={false} onCancel={handleClose} onOk={handleOk}>
        <Form form={form}>
          <Form.Item label="标题" name="__title__" required rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(Tabs);
