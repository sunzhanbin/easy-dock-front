import { FC, memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Button, Tooltip, message } from 'antd';
import PreviewModal from '@components/preview-model';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useConfirmLeave from '@common/hooks/use-confirm-leave';
import { useHistory, useRouteMatch, NavLink, useLocation, useParams } from 'react-router-dom';
import { save as saveExtend } from '@app/app';
import { save as saveFlow, setDirty as setFlowDirty } from '../flow-design/flow-slice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { AsyncButton, confirm, Icon } from '@common/components';
import { axios } from '@utils';
import Header from '../../../components/header';
import { layoutSelector, subAppSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { saveForm, setIsDirty as setFormDirty } from '@/features/bpm-editor/form-design/formdesign-slice';
import dirtySelector from '../use-dirty-selector';
import styles from './index.module.scss';

const EditorHeader: FC = () => {
  const dispatch = useAppDispatch();
  const [showModel, setShowModel] = useState<boolean>(false);
  const { name: appName, appId } = useAppSelector(subAppSelector);
  const dirty = useAppSelector(dirtySelector);
  const layout = useAppSelector(layoutSelector);
  const history = useHistory();
  const { bpmId } = useParams<{ bpmId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const match = useRouteMatch();
  const { pathname: pathName } = useLocation<{ pathname: string }>();
  const showConfirm = useMemoCallback((go) => {
    confirm({
      okText: '保存更改',
      cancelText: '放弃保存',
      width: 352,
      text: '当前有未保存的更改，您在离开当前页面是否要保存这些更改?',
      async onEnsure() {
        const saveRes = await handleSave();

        if (saveRes && saveRes.meta.requestStatus === 'rejected') return;

        go();
      },
      onCancel() {
        dispatch(setFormDirty({ isDirty: false }));
        dispatch(setFlowDirty(false));
        go();
      },
    });
  });

  useConfirmLeave(process.env.NODE_ENV === 'development' ? false : dirty, showConfirm);

  const flowDesignPath = `${match.url}/flow-design`;
  const extendPath = `${match.url}/extend`;
  const formDesignPath = useMemo(() => {
    return `${match.url}/form-design`;
  }, [match]);
  const handlePreview = useCallback(() => {
    setShowModel(true);
  }, []);
  const handlePrev = useCallback(() => {
    if (pathName === flowDesignPath) {
      history.replace(formDesignPath);
    }
  }, [pathName, history, formDesignPath, flowDesignPath]);

  const handleSave = useMemoCallback(async () => {
    if (pathName === formDesignPath) {
      return await dispatch(saveForm({ subAppId: bpmId, isShowTip: true, isShowErrorTip: true }));
    }

    if (pathName === flowDesignPath) {
      return await dispatch(saveFlow({ subappId: bpmId, showTip: true }));
    }

    if (pathName === extendPath) {
      return await dispatch(saveExtend());
    }
  });

  const handleNext = useCallback(() => {
    if (pathName === formDesignPath) {
      history.replace(flowDesignPath);
    }
  }, [pathName, history, formDesignPath, flowDesignPath]);

  const handlePublish = useCallback(async () => {
    const flowResponse = await dispatch(saveFlow({ subappId: bpmId }));

    if (flowResponse.meta.requestStatus === 'rejected') {
      return;
    }

    await axios.post('/subapp/deploy', {
      enableNewVersion: true,
      remark: '',
      subappId: bpmId,
    });

    message.success('发布成功');

    setTimeout(() => {
      window.location.replace(`/builder/app/${appId}`);
    }, 1500);
  }, [bpmId, dispatch, appId]);

  useEffect(() => {
    if (!dirty || process.env.NODE_ENV === 'development') return;

    const beforeLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '编辑的内容尚未保存，请确认是否离开？';
    };

    window.addEventListener('beforeunload', beforeLeave);
    return () => {
      window.removeEventListener('beforeunload', beforeLeave);
    };
  }, [dirty]);

  const handleGoBack = useCallback(() => {
    if (dirty) {
      showConfirm(() => {
        setTimeout(() => {
          history.goBack();
        }, 100);
      });
    } else {
      history.goBack();
    }
  }, [dirty, history, showConfirm]);

  const disableFlowDesignLink = useMemo(() => {
    if (pathName === formDesignPath && layout.length === 0) return true;

    if (pathName === flowDesignPath) return true;

    return false;
  }, [pathName, layout, formDesignPath, flowDesignPath]);

  return (
    <div className={styles.header_container} ref={containerRef}>
      <Header backText={appName} className={styles.edit_header} goBack={handleGoBack}>
        <div className={styles.steps}>
          <NavLink
            className={styles.step}
            replace={true}
            to={`${match.url}/form-design`}
            activeClassName={styles.active}
          >
            <span className={styles.number}>01</span>
            <span>表单设计</span>
          </NavLink>
          <div className={styles.separator}>
            <Icon className={styles.iconfont} type="jinru" />
          </div>
          <NavLink
            className={styles.step}
            replace={true}
            to={`${match.url}/flow-design`}
            activeClassName={styles.active}
            style={{
              cursor: disableFlowDesignLink ? 'not-allowed' : 'pointer',
              color: disableFlowDesignLink ? 'rgba(24, 31, 67, 0.5)' : 'rgba(24, 31, 67, 0.95)',
            }}
            onClick={(e) => {
              if (disableFlowDesignLink) {
                e.preventDefault();
              }
            }}
          >
            <span className={styles.number}>02</span>
            <span>流程设计</span>
          </NavLink>
          <div className={styles.separator}>
            <Icon className={styles.iconfont} type="jinru" />
          </div>
          <NavLink className={styles.step} replace={true} to={extendPath} activeClassName={styles.active}>
            <span className={styles.number}>03</span>
            <span>扩展功能</span>
          </NavLink>
        </div>
        <div className={styles.operation}>
          {/* 这个版本暂时不做 */}
          {/* 
            <Icon className={styles.iconfont} type="jiantoushangyibu" />
            <Icon className={styles.iconfont} type="jiantouxiayibu" />
          */}
          {pathName === formDesignPath && (
            <Tooltip title="预览" placement="left">
              <span>
                <Icon
                  className={styles.iconfont}
                  type="yulan"
                  onClick={handlePreview}
                  // style={{ cursor: layout.length === 0 ? 'not-allowed' : 'pointer' }}
                />
              </span>
            </Tooltip>
          )}
          {pathName === flowDesignPath && (
            <Button className={styles.prev} size="large" onClick={handlePrev}>
              上一步
            </Button>
          )}

          {pathName !== extendPath && (
            <Button type="primary" ghost className={styles.save} size="large" onClick={handleSave}>
              保存
            </Button>
          )}

          {pathName === formDesignPath && (
            <Button
              type="primary"
              className={styles.next}
              size="large"
              onClick={handleNext}
              disabled={layout.length === 0}
            >
              下一步
            </Button>
          )}
          {pathName === `${match.url}/flow-design` && (
            <AsyncButton
              className={styles.publish}
              type="primary"
              size="large"
              icon={<Icon className={styles.iconfont} type="fabu" />}
              onClick={handlePublish}
            >
              发布
            </AsyncButton>
          )}
        </div>
      </Header>
      {showModel && (
        <PreviewModal
          visible={showModel}
          onClose={() => {
            setShowModel(false);
          }}
        />
      )}
    </div>
  );
};

export default memo(EditorHeader);
