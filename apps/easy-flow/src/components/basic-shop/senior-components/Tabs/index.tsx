import { memo, useState } from 'react';
import { Tabs as TabList, Modal, Form, Input } from 'antd';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';

const { TabPane } = TabList;
type PaneType = {
  title: string;
  content: any;
  key: string;
};

const Tabs = () => {
  const [form] = Form.useForm();
  const [panes, setPanes] = useState<PaneType[]>([{ title: 'tab', content: '1', key: '1' }]);
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
      const key = Date.now().toString();
      list.push({ key, title, content: '1111' });
      setPanes(list);
      setActiveKey(key);
      handleClose();
    });
  });
  const handleChange = useMemoCallback((key) => {
    setActiveKey(key);
  });
  return (
    <div className={styles.tabs}>
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
              {content}
            </TabPane>
          );
        })}
      </TabList>
      <Modal visible={showModal} title={null} closable={false} onCancel={handleClose} onOk={handleOk}>
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
