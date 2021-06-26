import { FC, memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import DesignZone from './design-zone';
import ToolBox from './toolbox';
import EditZone from './edit-zone';
import { setLayout, setById, selectField, setIsDirty, setErrors } from './formdesign-slice';
import { ComponentConfig, ConfigItem, FormFieldMap } from '@/type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { dirtySelector, selectedFieldSelector } from './formzone-reducer';
import { axios } from '@/utils';
import { Prompt, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.module.scss';
import { saveForm } from '@/features/bpm-editor/form-design/formdesign-slice';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AsyncButton } from '@common/components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const FormDesign: FC<{}> = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const selectedField = useAppSelector(selectedFieldSelector);
  const isDirty = useAppSelector(dirtySelector);
  const { bpmId: subAppId } = useParams<{ bpmId: string }>();
  const [isShowTip, setIsShowTip] = useState<boolean>(false);
  const cancelSaveRef = useRef<boolean>();
  const targetUrlRef = useRef<string>();
  const { url } = useRouteMatch();
  useEffect(() => {
    // 初始化表单数据
    axios.get(`/form/${subAppId}`).then((res) => {
      const { meta } = res.data;
      if (meta) {
        const { layout, components } = meta;
        const byId: { [k: string]: ConfigItem } = {};
        const selectFieldId = (layout.length > 0 && layout[0].length > 0 && layout[0][0]) || '';
        components.forEach(({ config, props }: ComponentConfig) => {
          const { id } = config;
          const componentConfig: ConfigItem = {};
          const excludeKeys = ['version', 'rules', 'canSubmit'];
          Object.keys(config).forEach((key) => {
            if (!excludeKeys.includes(key)) {
              componentConfig[key] = config[key];
            }
          });
          Object.keys(props).forEach((key) => {
            componentConfig[key] = props[key];
          });
          byId[id as string] = componentConfig;
        });
        dispatch(setById({ byId: byId as FormFieldMap }));
        dispatch(setLayout({ layout }));
        selectFieldId && dispatch(selectField({ id: selectFieldId }));
      } else {
        dispatch(setById({ byId: {} }));
        dispatch(setLayout({ layout: [] }));
        dispatch(selectField({ id: '' }));
      }
      dispatch(setErrors({ errors: [] }));
      // 临时规避dispatch时序的问题
      setTimeout(() => {
        dispatch(setIsDirty({ isDirty: false }));
      }, 10);
    });
  }, [subAppId, dispatch]);
  const handleConfirmLeave = useMemoCallback((location: ReturnType<typeof useLocation>) => {
    if (isDirty && url !== location.pathname && !cancelSaveRef.current) {
      targetUrlRef.current = location.pathname + location.search;
      setIsShowTip(true);
      return false;
    }
    return true;
  });
  const handleSave = useMemoCallback(async () => {
    const formResponse = await dispatch(saveForm({ subAppId: subAppId, isShowTip: false, isShowErrorTip: true }));
    if (formResponse.meta.requestStatus === 'rejected') {
      setIsShowTip(false);
      return;
    }
    if (targetUrlRef.current) {
      history.replace(targetUrlRef.current);
    }
  });
  const handleCancelUnSaveModal = useMemoCallback(() => {
    setIsShowTip(false);
    cancelSaveRef.current = true;
    if (targetUrlRef.current) {
      history.replace(targetUrlRef.current);
    }
  });
  const handleCloseUnSaveModal = useMemoCallback(() => {
    setIsShowTip(false);
  });
  return (
    <>
      <Prompt when={isDirty} message={handleConfirmLeave} />
      <Modal
        maskClosable={false}
        destroyOnClose
        visible={isShowTip}
        width={352}
        title={
          <div className={styles.tipTitle}>
            <ExclamationCircleFilled />
            提示
          </div>
        }
        onCancel={handleCloseUnSaveModal}
        footer={
          <>
            <AsyncButton size="large" onClick={handleCancelUnSaveModal}>
              放弃保存
            </AsyncButton>
            <AsyncButton type="primary" size="large" onClick={handleSave}>
              保存更改
            </AsyncButton>
          </>
        }
      >
        当前有未保存的更改，您在离开当前页面前是否要保存这些更改?
      </Modal>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.container}>
          <ToolBox></ToolBox>
          <DesignZone></DesignZone>
          {selectedField ? <EditZone></EditZone> : null}
        </div>
      </DndProvider>
    </>
  );
};

export default memo(FormDesign);
