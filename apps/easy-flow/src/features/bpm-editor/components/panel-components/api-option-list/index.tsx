import {memo, useMemo, useState} from 'react';
import {Form} from 'antd';
import {FormField, OptionMode, SelectOptionItem} from '@/type';
import {useAppSelector} from '@/app/hooks';
import {componentPropsSelector} from '@/features/bpm-editor/form-design/formzone-reducer';
import styles from './index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';
import DataApiConfig from '@/features/bpm-editor/components/data-api-config';
import ResponseNoMap from '@/features/bpm-editor/components/data-api-config/response-no-map';
import FillComponent from '@/features/bpm-editor/components/data-api-config/select-fill-component';

interface editProps {
  id?: string;
  value?: SelectOptionItem;
  onChange?: (v: SelectOptionItem) => void;
}

const ApiOptionList = (props: editProps) => {
  const {id, value, onChange} = props;
  const byId = useAppSelector(componentPropsSelector);
  console.log(byId, 'propddddd')
  const [type] = useState<OptionMode>(value?.type || 'custom');

  const fields = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => com.type !== 'DescText' && com.id !== id)
      .map((com) => ({id: com.fieldName, name: com.label}));
  }, [byId, id]);

  const fieldTables = useMemo<{ key: string; value: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    return componentList
      .filter((com) => com.type === 'Table')
      .map((com) => ({key: com.fieldName, value: com.label}));
  }, [byId, id]);
  
  const handleApiChange = useMemoCallback((apiConfig) => {
    onChange && onChange({type, apiConfig});
  });

  const renderContent = useMemoCallback(() => {
    return (
      <Form.Item className={styles.form} name="apiConfig" label="选择要读取数据的接口">
        <DataApiConfig
          name={['dataSource', 'apiConfig']}
          label="为表单控件匹配请求参数"
          layout="vertical"
          className={styles.apiConfig}
          fields={fields}
          onChange={handleApiChange}
        >
          <ResponseNoMap label="选择返回参数"/>
          <FillComponent label="选择回填的控件" options={fieldTables}/>
        </DataApiConfig>
      </Form.Item>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default memo(ApiOptionList);