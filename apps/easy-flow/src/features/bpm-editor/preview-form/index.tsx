import { memo, FC, useMemo, useCallback } from 'react';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector, layoutSelector, subAppSelector } from '../form-design/formzone-reducer';
import FormEngine from '@components/form-engine';
import { FormMeta } from '@type/detail';
import { FieldAuthsMap } from '@type/flow';
import { useHistory } from 'react-router-dom';
import { Icon } from '@common/components';
import styles from './index.module.scss';

const PreviewForm: FC = () => {
  const { name: appName } = useAppSelector(subAppSelector);
  const layout = useAppSelector(layoutSelector);
  const byId = useAppSelector(componentPropsSelector);
  const history = useHistory();

  const formDesign = useMemo(() => {
    const formMeta = {
      layout,
      events: {
        onchange: [],
      },
      rules: [],
      themes: [{}],
      components: Object.keys(byId).map((id) => Object.assign({}, byId[id], { type: id.split('_')[0] || '', id })),
      selectedTheme: '',
    };
    return formMeta;
  }, [layout, byId]);
  const auths = useMemo(() => {
    const res: FieldAuthsMap = {};
    Object.keys(byId).forEach((id) => {
      res[id] = 2;
    });
    return res;
  }, [byId]);
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>预览表单</div>
        <div className={styles.close} onClick={handleClose}>
          <Icon className={styles.iconfont} type="guanbi" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{appName}</div>
        <div className={styles.form_content}>
          <FormEngine initialValue={{}} data={(formDesign as unknown) as FormMeta} fieldsAuths={auths}></FormEngine>
        </div>
      </div>
    </div>
  );
};

export default memo(PreviewForm);
