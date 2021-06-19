import { FC, memo, useCallback, useMemo } from 'react';
import { Button, Tooltip, message } from 'antd';
import { useHistory, useRouteMatch, NavLink, useLocation, useParams } from 'react-router-dom';
import { save, saveWithForm } from '../flow-design/flow-slice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { AsyncButton } from '@common/components';
import { axios } from '@utils';
import Header from '../../../components/header';
import { Icon } from '@common/components';
import { layoutSelector, subAppSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { saveForm } from '@/features/bpm-editor/form-design/formdesign-slice';
import styles from './index.module.scss';

const EditorHeader: FC = () => {
  const dispatch = useAppDispatch();
  const { name: appName, appId } = useAppSelector(subAppSelector);
  const layout = useAppSelector(layoutSelector);
  const history = useHistory();
  const { bpmId } = useParams<{ bpmId: string }>();
  const match = useRouteMatch();
  const { pathname: pathName } = useLocation<{ pathname: string }>();
  const flowDesignPath = `${match.url}/flow-design`;
  const formDesignPath = useMemo(() => {
    return `${match.url}/form-design`;
  }, [match]);
  const handlePreview = useCallback(() => {
    if (pathName === formDesignPath) {
      history.push(`${match.url}/preview-form`);
    }
  }, [pathName, history, formDesignPath, match]);
  const handlePrev = useCallback(() => {
    if (pathName === flowDesignPath) {
      history.push(formDesignPath);
    }
  }, [pathName, history, formDesignPath, flowDesignPath]);
  const handleSave = useCallback(() => {
    if (pathName === formDesignPath) {
      dispatch(saveForm({ subAppId: bpmId, isShowTip: true, isShowErrorTip: true }));
    }

    if (pathName === flowDesignPath) {
      dispatch(save(bpmId));
    }
  }, [pathName, dispatch, formDesignPath, flowDesignPath, bpmId]);
  const handleNext = useCallback(() => {
    if (pathName === formDesignPath) {
      history.push(flowDesignPath);
    }
  }, [pathName, history, formDesignPath, flowDesignPath]);

  const handlePublish = useCallback(async () => {
    const formResponse = await dispatch(saveForm({ subAppId: bpmId, isShowTip: false, isShowErrorTip: true }));

    if (formResponse.meta.requestStatus === 'rejected') {
      return;
    }

    const flowResponse = await dispatch(saveWithForm(bpmId));

    if (flowResponse.meta.requestStatus === 'rejected') {
      return;
    }

    await axios.post('/subapp/deploy', {
      enableNewVersion: true,
      remark: '',
      subappId: bpmId,
    });

    message.success('发布成功');
  }, [bpmId, dispatch]);
  const handleGoBack = useCallback(() => {
    window.location.href = `${window.location.origin}/scenes-detail/${appId}`;
  }, [appId]);

  const jumpToTask = useCallback(() => {
    history.push(`/task-center/${appId}/todo`);
  }, [appId, history]);

  return (
    <div className={styles.header_container}>
      <Header backText={appName} className={styles.edit_header} goBack={handleGoBack}>
        <div className={styles.steps}>
          <NavLink className={styles.step} to={`${match.url}/form-design`} activeClassName={styles.active}>
            <span className={styles.number}>01</span>
            <span>表单设计</span>
          </NavLink>
          <div className={styles.separator}>
            <Icon className={styles.iconfont} type="jinru" />
          </div>
          <NavLink className={styles.step} to={`${match.url}/flow-design`} activeClassName={styles.active}>
            <span className={styles.number}>02</span>
            <span>流程设计</span>
          </NavLink>
        </div>
        <div className={styles.operation}>
          {/* 这个版本暂时不做 */}
          {/* 
            <Icon className={styles.iconfont} type="jiantoushangyibu" />
            <Icon className={styles.iconfont} type="jiantouxiayibu" />
          */}
          {pathName === formDesignPath && (
            <Tooltip title="预览">
              <Icon className={styles.iconfont} type="yulan" onClick={handlePreview} />
            </Tooltip>
          )}
          {pathName === flowDesignPath && (
            <Button className={styles.prev} size="large" onClick={handlePrev}>
              上一步
            </Button>
          )}
          <Button type="primary" ghost className={styles.save} size="large" onClick={handleSave}>
            保存
          </Button>
          {/* 任务中心临时入口 */}
          <Button type="primary" className={styles.next} size="large" onClick={jumpToTask}>
            任务中心
          </Button>
          {pathName === formDesignPath && layout.length > 0 && (
            <Button type="primary" className={styles.next} size="large" onClick={handleNext}>
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
    </div>
  );
};

export default memo(EditorHeader);
