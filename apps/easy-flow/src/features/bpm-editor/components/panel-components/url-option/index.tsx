import { memo, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import DataApiConfig from '@/features/bpm-editor/components/data-api-config';
import ResponseNoMap from '@/features/bpm-editor/components/data-api-config/response-no-map';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { FormField } from '@/type';

interface UrlOptionProps {
  id?: string;
  value?: any;
  onChange?: (value: this['value']) => void;
}

const UrlOption = ({ id, value, onChange }: UrlOptionProps) => {
  const [type, setType] = useState<string>(value?.type || 'custom');
  const byId = useAppSelector(componentPropsSelector);
  const fields = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => !['DescText', 'Tabs'].includes(com.type) && com.id !== id)
      .map((com) => ({ id: com.fieldName, name: com.label }));
  }, [byId, id]);
  const handleApiChange = useMemoCallback(() => {});
  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <Form.Item>
          <Input size="large" placeholder="请输入url" />
        </Form.Item>
      );
    }
    if (type === 'interface') {
      return (
        <Form.Item className={styles.form} name="apiConfig" label="">
          <DataApiConfig
            name={['dataSource', 'apiConfig']}
            label="匹配请求参数"
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
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div
          className={classNames(styles.custom, type === 'custom' ? styles.active : '')}
          onClick={() => setType('custom')}
        >
          自定义数据
        </div>
        <div
          className={classNames(styles.custom, type === 'interface' ? styles.active : '')}
          onClick={() => setType('interface')}
        >
          接口数据
        </div>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default memo(UrlOption);
