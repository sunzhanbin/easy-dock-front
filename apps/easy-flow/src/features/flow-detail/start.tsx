import { memo, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import classnames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AsyncButton, Icon, Loading } from '@common/components';
import { axios } from '@utils';
import { FillNode } from '@type/flow';
import { FormMeta, FormValue } from './type';
import Form from '@components/form-engine';
import Header from '../../components/header';
import styles from './index.module.scss';

if (process.env.NODE_ENV === 'development') {
  require('./mock');
}

type DataType = {
  processMeta: FillNode;
  formMeta: FormMeta;
  formData: FormValue;
};

function StartFlow() {
  const { subAppId } = useParams<{ subAppId: string }>();
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get<DataType>(`/flow/detail/${subAppId}`)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [subAppId]);

  const formVnode = useMemo(() => {
    if (!data) return null;

    const { formMeta, formData, processMeta } = data;
    return <Form data={formMeta} initialValue={formData} fieldsAuths={processMeta.fieldsAuths} />;
  }, [data]);

  const handleSubmit = useMemoCallback(async () => {
    await new Promise((r) => {
      setTimeout(r, 1000);
    });

    return;
  });

  const btns = data?.processMeta.btnText;

  return (
    <div className={styles.container}>
      {loading && <Loading />}

      <Header className={styles.header} backText="发起流程">
        <div className={styles.btns}>
          {btns?.submit?.enable && (
            <AsyncButton
              disabled={!data}
              onClick={handleSubmit}
              type="primary"
              size="large"
              icon={<Icon type="fabu" />}
            >
              {btns.submit.text}
            </AsyncButton>
          )}
        </div>
      </Header>

      <div className={styles['start-form-wrapper']}>
        <div className={classnames(styles.form)}>
          <div className={styles.title}>燃气报修</div>
          {formVnode}
        </div>
      </div>
    </div>
  );
}

export default memo(StartFlow);
