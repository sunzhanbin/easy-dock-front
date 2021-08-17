import { memo, FC, useMemo, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Icon } from '@common/components';
import { useAppSelector } from '@/app/hooks';
import {
  componentPropsSelector,
  formRulesSelector,
  layoutSelector,
  subAppSelector,
} from '@/features/bpm-editor/form-design/formzone-reducer';
import FormEngine from '@components/form-engine';
import { Datasource, FormMeta } from '@type/detail';
import { FieldAuthsMap, AuthType } from '@type/flow';
import { ComponentConfig } from '@/type';
import { fetchDataSource } from '@/apis/detail';
import styles from './index.module.scss';

const propsKey = ['defaultValue', 'showSearch', 'multiple', 'format', 'notSelectPassed'];

const PreviewModal: FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const { name: appName } = useAppSelector(subAppSelector);
  const layout = useAppSelector(layoutSelector);
  const byId: { [k: string]: any } = useAppSelector(componentPropsSelector);
  const formRules = useAppSelector(formRulesSelector);
  const [dataSource, setDataSource] = useState<Datasource>({});
  useEffect(() => {
    fetchDataSource(Object.values(byId)).then((res) => {
      setDataSource(res);
    });
  }, [byId]);
  const formDesign = useMemo(() => {
    const components: ComponentConfig[] = [];
    Object.keys(byId).forEach((id) => {
      const object = byId[id];
      // TODO any @王朝传
      const component: ComponentConfig = { config: {}, props: {} } as any;
      Object.keys(object).forEach((key) => {
        if (propsKey.includes(key)) {
          component.props[key] = (object as any)[key];
        } else {
          component.config[key] = (object as any)[key];
        }
      });
      components.push(component);
    });
    const formMeta = {
      layout,
      events: {
        onchange: [],
      },
      rules: [],
      formRules,
      themes: [{}],
      components: components,
      selectedTheme: '',
    };
    return formMeta;
  }, [layout, byId, formRules]);
  const auths = useMemo(() => {
    const res: FieldAuthsMap = {};
    Object.keys(byId).forEach((id) => {
      const { fieldName = '' } = byId[id];
      res[fieldName || id] = AuthType.Edit;
    });
    return res;
  }, [byId]);
  const title = useMemo(() => {
    return (
      <div className="header">
        <div className="title">预览表单</div>
        <div className="close" onClick={onClose}>
          <Icon className="iconfont" type="guanbi" />
        </div>
      </div>
    );
  }, [onClose]);
  return (
    <Modal
      visible={visible}
      title={title}
      footer={null}
      onCancel={onClose}
      wrapClassName={styles.container}
      destroyOnClose={true}
    >
      <div className="content">
        <div className="title">{appName}</div>
        <div className="form_content">
          <FormEngine
            datasource={dataSource}
            initialValue={{}}
            data={(formDesign as unknown) as FormMeta}
            fieldsAuths={auths}
          ></FormEngine>
        </div>
      </div>
    </Modal>
  );
};

export default memo(PreviewModal);
