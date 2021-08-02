import { memo, useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useHistory } from 'react-router';
import classnames from 'classnames';
import { FormInstance, message } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AsyncButton, Loading } from '@common/components';
import { runtimeAxios } from '@utils';
import { dynamicRoutes } from '@consts';
import { loadDatasource } from '@apis/detail';
import { FillNode } from '@type/flow';
import { FormMeta, FormValue, Datasource } from '@type/detail';
import Form from '@components/form-engine';
import Header from '@components/header';
import useSubapp from '@/hooks/use-subapp';
import styles from './index.module.scss';
import titleImage from '@/assets/title.png';

type DataType = {
  processMeta: FillNode;
  formMeta: FormMeta;
  formData: FormValue;
};

function StartFlow() {
  const { subAppId } = useParams<{ subAppId: string }>();
  const history = useHistory();
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState(true);
  const { data: subApp } = useSubapp(subAppId);
  const formRef = useRef<FormInstance<FormValue>>(null);
  const [datasource, serDatasource] = useState<Datasource>();

  useEffect(() => {
    if (!subApp) return;

    (async function () {
      setLoading(true);

      try {
        const [processMeta, formMeta] = await Promise.all([
          runtimeAxios.get(`/process_instance/getStartNodeCSS?versionId=${subApp.version.id}`).then((response) => {
            return JSON.parse(response.data);
          }),
          runtimeAxios.get(`/form/version/${subApp.version.id}`).then((response) => {
            return response.data.meta;
          }),
        ]);

        setData({
          formMeta,
          processMeta,
          formData: {},
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [subApp]);

  useEffect(() => {
    if (!data || !subApp) return;

    loadDatasource(data.formMeta, data.processMeta, subApp.version.id).then((values) => {
      serDatasource(values);
    });
  }, [data, subApp]);

  const formVnode = useMemo(() => {
    if (!data || !datasource) return null;

    const { formMeta, formData, processMeta } = data;
    return (
      <Form
        datasource={datasource}
        ref={formRef}
        data={formMeta}
        initialValue={formData}
        fieldsAuths={processMeta.fieldsAuths}
      />
    );
  }, [data, datasource]);

  const handleSubmit = useMemoCallback(async () => {
    if (!formRef.current || !subApp) return;
    const values = await formRef.current.validateFields();

    await runtimeAxios.post(`/process_instance/start`, {
      formData: values,
      versionId: subApp.version.id,
    });

    message.success('提交成功');

    setTimeout(() => {
      // 回任务中心我的发起
      history.replace(`${dynamicRoutes.toTaskCenter(subApp.app.id)}/start`);
    }, 1500);
  });

  const btns = data?.processMeta.btnText;

  return (
    <div className={styles.container}>
      {loading && <Loading />}

      <Header className={styles.header} backText="发起流程">
        <div className={styles.btns}>
          {btns?.submit?.enable && (
            <AsyncButton disabled={!data} className={styles.submit} onClick={handleSubmit} type="primary" size="large">
              {btns.submit.text || '提交'}
            </AsyncButton>
          )}
        </div>
      </Header>
      <div className={styles.background}>
        <div className={styles.left}></div>
        <div className={styles.right}></div>
      </div>
      {subApp && (
        <div className={styles['start-form-wrapper']}>
          <div className={classnames(styles.form)} style={{ height: `${document.body.clientHeight - 124}px` }}>
            <div className={styles.title}>
              <img src={titleImage} alt="title" className={styles.image} />
              <span>{subApp.name}</span>
            </div>
            {formVnode}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(StartFlow);
