import { memo, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import DataApiConfig from '@/features/bpm-editor/components/data-api-config';
import ResponseNoMap from '@/features/bpm-editor/components/data-api-config/response-no-map';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { FormField, UrlOptionItem } from '@/type';

interface UrlOptionProps {
  id?: string;
  value?: UrlOptionItem;
  onChange?: (value: this['value']) => void;
}

const UrlOption = ({ id, value, onChange }: UrlOptionProps) => {
  const [type, setType] = useState<UrlOptionItem['type']>(value?.type || 'custom');
  const byId = useAppSelector(componentPropsSelector);
  const fields = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => !['DescText', 'Tabs', 'Iframe', 'Table', 'FlowData'].includes(com.type))
      .map((com) => ({ id: com.fieldName, name: com.label }));
  }, [byId]);

  const handleApiChange = useMemoCallback(() => {});
  const handleChangeType = useMemoCallback((type: UrlOptionItem['type']) => {
    const newValue = Object.assign({}, value, { type });
    onChange && onChange(newValue);
    setType(type);
  });
  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <Form.Item
          name={['url', 'customValue']}
          rules={[
            {
              validator(_: any, val: string) {
                if (!val) {
                  return Promise.reject(new Error('请输入url地址'));
                }
                // eslint-disable-next-line
                const urlRegex = /(^(http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/;
                if (!urlRegex.test(val)) {
                  return Promise.reject(new Error('请输入正确的url地址'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input size="large" placeholder="请输入url" />
        </Form.Item>
      );
    }
    if (type === 'interface') {
      return (
        <Form.Item className={styles.form} name={['url', 'apiConfig']} label="">
          <DataApiConfig
            name={['url', 'apiConfig']}
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
    <div className={styles.container} key={id}>
      <div className={styles.title}>
        <div
          className={classNames(styles.custom, type === 'custom' ? styles.active : '')}
          onClick={() => handleChangeType('custom')}
        >
          自定义数据
        </div>
        <div
          className={classNames(styles.custom, type === 'interface' ? styles.active : '')}
          onClick={() => handleChangeType('interface')}
        >
          接口数据
        </div>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default memo(UrlOption);
