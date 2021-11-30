import { memo, useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useHistory } from 'react-router';
import classnames from 'classnames';
import { FormInstance, message } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AsyncButton, Loading, PopoverConfirm } from '@common/components';
import { runtimeAxios } from '@utils';
import { dynamicRoutes } from '@consts';
import { loadDatasource, deleteDraft } from '@apis/detail';
import { StartNode } from '@type/flow';
import { FormMeta, FormValue, Datasource } from '@type/detail';
import Form from '@components/form-engine';
import Header from '@components/header';
import useSubapp from '@/hooks/use-subapp';
import styles from './index.module.scss';
import titleImage from '@/assets/title.png';
import leftImage from '@assets/background_left.png';
import rightImage from '@assets/background_right.png';
import { uploadFile } from '@utils';

type DataType = {
  processMeta: StartNode;
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
  const [showDelete, setShowDelete] = useState(false);
  const projectId = useMemo(() => {
    if (subApp && subApp.app) {
      return subApp.app?.project?.id;
    }
  }, [subApp]);

  useEffect(() => {
    if (!subApp) return;

    (async function () {
      setLoading(true);

      try {
        const [processMeta, formMeta, formValues] = await Promise.all([
          runtimeAxios.get(`/process_instance/getStartNodeCSS?versionId=${subApp.version.id}`).then((response) => {
            return JSON.parse(response.data);
          }),
          runtimeAxios.get(`/form/version/${subApp.version.id}`).then((response) => {
            return response.data.meta;
          }),
          runtimeAxios.get(`/task/draft/${subApp.id}`).then((response) => {
            return response.data?.meta;
          }),
        ]);

        setShowDelete(Boolean(formValues));

        setData({
          formMeta,
          processMeta,
          formData: formValues || {},
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [subApp]);

  useEffect(() => {
    if (!data || !subApp) return;

    loadDatasource(data.formMeta, data.processMeta.fieldsAuths, subApp.version.id, '').then((values) => {
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
        className={styles['form-engine']}
        initialValue={formData}
        projectId={projectId}
        fieldsAuths={processMeta.fieldsAuths}
        nodeType="start"
      />
    );
  }, [data, datasource, projectId]);

  const handleSubmit = useMemoCallback(async () => {
    if (!formRef.current || !subApp) return;
    const res = formRef.current.validateFields();
    // 校验并提示tabs内控件错误
    res.catch((error) => {
      const { errorFields = [], values } = error;
      if (errorFields.length > 0) {
        const tabsNameMapIndex: { [k: string]: number } = {};
        Object.keys(values)
          .filter((name) => Array.isArray(values[name]))
          .forEach((name, index) => {
            tabsNameMapIndex[name] = index;
          });
        const errorTabList = errorFields
          .filter((field: { name: string[] }) => field.name.length === 3)
          .map((v: { name: string[] }) => v.name)
          .map((name: [string, string, string]) => `${name[0]},${name[1]}`);
        const errorTabs = Array.from(new Set(errorTabList)).map((name) => {
          const [tabName, paneKey] = (name as string).split(',');
          return {
            tabIndex: tabsNameMapIndex[tabName],
            paneIndex: Number(paneKey),
          };
        });
        if (errorTabs.length < 1) {
          return;
        }
        errorTabs.forEach((item) => {
          const { tabIndex, paneIndex } = item;
          const selector = `.ant-form .ant-tabs:nth-child(${tabIndex + 1})  .ant-tabs-tab:nth-child(${paneIndex + 1})`;
          const el = document.querySelector(selector);
          if (el) {
            (el as HTMLDivElement).style.borderColor = '#ff5568';
          }
        });
      }
    });
    const values = await formRef.current.validateFields();
    const formValues = await uploadFile(values);
    // 上传文件成功之后再提交表单
    await runtimeAxios.post(`/process_instance/start`, {
      formData: formValues,
      versionId: subApp.version.id,
    });

    message.success('提交成功');

    setTimeout(() => {
      // 回任务中心我的发起
      history.replace(`${dynamicRoutes.toTaskCenter(subApp.app.id)}/start`);
    }, 1500);
  });

  const handleSave = useMemoCallback(async () => {
    if (!formRef.current || !subApp) return;
    const values = await formRef.current.getFieldsValue(true);
    const formValues = await uploadFile(values);

    await runtimeAxios.post(`/task/draft/add`, {
      formData: formValues,
      subappId: subApp.id,
    });

    message.success('保存成功');
  });

  const handleDeleteDraft = useMemoCallback(async () => {
    await deleteDraft(subAppId);

    message.success('删除成功');

    if (subApp) {
      setTimeout(() => {
        // 回任务中心草稿列表
        history.replace(`${dynamicRoutes.toTaskCenter(subApp.app.id)}/draft`);
      }, 1500);
    }
  });

  return (
    <div className={styles.container}>
      {loading && <Loading />}

      <Header className={styles.header} backText="发起流程">
        <div className={styles.btns}>
          {showDelete && (
            <PopoverConfirm title="确认删除" content="确认删除该草稿吗?" onConfirm={handleDeleteDraft}>
              <AsyncButton disabled={!data} className={styles.save} size="large">
                删除
              </AsyncButton>
            </PopoverConfirm>
          )}
          <AsyncButton disabled={!data} className={styles.save} onClick={handleSave} size="large">
            保存
          </AsyncButton>

          <AsyncButton disabled={!data} className={styles.submit} onClick={handleSubmit} size="large">
            提交
          </AsyncButton>
        </div>
      </Header>
      <div className={styles.background}>
        <div className={styles.left} style={{ backgroundImage: `url(${leftImage})` }}></div>
        <div className={styles.right} style={{ backgroundImage: `url(${rightImage})` }}></div>
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
