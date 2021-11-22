import React, { useCallback, useMemo, useState } from 'react';
import { Tabs, Input } from 'antd';
import { useSelector } from 'react-redux';
import { useFetchsubAppListQuery } from '@/http/app-manager.hooks';
import { selectCurrentWorkspaceId } from '@/views/app-manager/index.slice';

const { TabPane } = Tabs;

const SubListComponent = () => {
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const { data: subApps } = useFetchsubAppListQuery(workspaceId);
  const [activeKey, setActiveKey] = useState<string>("1");

  const handleTabsChange = useCallback((activeKey: string) => {
    setActiveKey(activeKey);
  }, []);

  const handleTabSearch = useCallback((value, event) => {
    event.preventDefault();
    console.log('value', value)
  }, [])

  const renderExtra = useMemo(() => {
    return (
      <>
        <Input.Search onSearch={handleTabSearch}/>
      </>
    )
  }, [handleTabSearch]);

  return (
    <>
      <Tabs activeKey={activeKey} onChange={handleTabsChange} tabBarExtraContent={renderExtra}>
        <TabPane tab="全部" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="表单" key="2">
          {subApps?.map((item: any) => (
            <React.Fragment key={item.id}>
              {item.name}
              <br/>
            </React.Fragment>
          ))}
        </TabPane>
        <TabPane tab="流程" key="3">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="报表" key="4">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="大屏" key="5">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="动画" key="6">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </>
  )
};

export default SubListComponent;
