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
import { ComponentConfig, FieldType, FormField, FormFieldMap, RadioField } from '@/type';
import { fetchDataSource } from '@/apis/detail';
import styles from './index.module.scss';
import classnames from 'classnames';
import titleImage from '@/assets/title.png';

const propsKey = ['defaultValue', 'showSearch', 'multiple', 'format', 'notSelectPassed'];
type Key = keyof FormField;

const PreviewModal: FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const { name: appName } = useAppSelector(subAppSelector);
  const layout = useAppSelector(layoutSelector);
  const byId: FormFieldMap = useAppSelector(componentPropsSelector);
  const formRules = useAppSelector(formRulesSelector);
  const [dataSource, setDataSource] = useState<Datasource>({});
  useEffect(() => {
    const components = Object.values(byId).filter((component) => {
      const { type } = component;
      return type === 'Radio' || type === 'Checkbox' || type === 'Select';
    });
    fetchDataSource(components as RadioField[]).then((res) => {
      setDataSource(res);
    });
  }, [byId]);
  const formDesign = useMemo(() => {
    const components: ComponentConfig[] = [];
    Object.keys(byId).forEach((id) => {
      const object = byId[id];
      const type = id.split('_')[0] as FieldType;
      const component: ComponentConfig = { config: { type, id }, props: { type, id } };
      Object.keys(object).forEach((key) => {
        if (propsKey.includes(key)) {
          component.props[key] = object[key as Key];
        } else {
          component.config[key] = object[key as Key];
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
        <div className={styles.background}>
          <div className={styles.left}></div>
          <div className={styles.right}></div>
        </div>
        <div className={styles['start-form-wrapper']}>
          <div className={classnames(styles.form)} style={{ height: `${document.body.clientHeight - 124}px` }}>
            <div className={styles.title}>
              <img src={titleImage} alt="title" className={styles.image} />
              <span>{appName}</span>
            </div>
            <FormEngine
              datasource={dataSource}
              initialValue={{}}
              data={(formDesign as unknown) as FormMeta}
              fieldsAuths={auths}
            ></FormEngine>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(PreviewModal);
