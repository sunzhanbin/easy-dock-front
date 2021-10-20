import { memo, useState, useRef, useEffect } from 'react';
import { Tabs as TabList, Modal, Form, Input } from 'antd';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';
import { CompConfig } from '@/type';
import FormList from './form-list';

const { TabPane } = TabList;
type PaneType = {
  title: string;
  content: any;
  key: string;
};

interface TabProps {
  fields?: CompConfig[];
  fieldName: string;
  value?: any;
  onChange?: (value: this['value']) => void;
}

const Tabs = ({ fields = [], fieldName, value, onChange }: TabProps) => {
  const [form] = Form.useForm();
  const tabRef = useRef<HTMLDivElement>(null);
  const content = useMemoCallback((key) => {
    return <FormList fields={fields} id={key} parentId={fieldName} />;
  });
  const [panes, setPanes] = useState<PaneType[]>([]);
  const [activeKey, setActiveKey] = useState<string>('1');
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleAdd = useMemoCallback(() => {
    setShowModal(true);
  });
  const handleRemove = useMemoCallback((key: string) => {
    const list = [...panes];
    const index = list.findIndex((pane) => pane.key === key);
    const paneList = list.filter((v) => v.key !== key);
    setPanes(paneList);
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
    form.setFieldsValue({ title: '' });
    setShowModal(false);
  });
  const handleOk = useMemoCallback(() => {
    form.validateFields().then((values) => {
      const { title } = values;
      const list = [...panes];
      const key = String(list.length);
      list.push({ key, title, content });
      setPanes(list);
      setActiveKey(key);
      handleClose();
    });
  });
  const handleChange = useMemoCallback((key) => {
    setActiveKey(key);
  });
  // 编辑态默认有个tab,用于展示编辑的控件
  useEffect(() => {
    const el = document.getElementById('edit-form');
    if (el?.contains(tabRef.current)) {
      setPanes([{ title: 'tab', content, key: '1' }]);
    }
  }, [tabRef, fieldName, content]);
  return (
    <div className={styles.tabs} ref={tabRef}>
      <TabList
        type="editable-card"
        activeKey={activeKey}
        addIcon={<Icon type="xinzeng" />}
        onEdit={handleEdit}
        onChange={handleChange}
      >
        {panes.map(({ title, content, key }) => {
          return (
            <TabPane tab={title} key={key}>
              {content(key)}
            </TabPane>
          );
        })}
      </TabList>
      <Modal visible={showModal} title="标题" closable={false} onCancel={handleClose} onOk={handleOk}>
        <Form form={form}>
          <Form.Item label="标题" name="title" required rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(Tabs);
