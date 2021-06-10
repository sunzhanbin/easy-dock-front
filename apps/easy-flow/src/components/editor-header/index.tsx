import { FC, memo, useCallback, useMemo } from 'react';
import { Button, Tooltip, message } from 'antd';
import styled from 'styled-components';
import { useHistory, useRouteMatch, NavLink, useLocation, useParams } from 'react-router-dom';
import { save } from '../../features/bpm-editor/flow-design/flow-slice';
import { AsyncButton } from '@common/components';
import { useAppDispatch } from '@/app/hooks';
import { axios } from '@utils';
import Header from '../header';
import { Icon } from '@common/components';
import { store } from '@/app/store';
import { FieldType, SchemaItem } from '@/type';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 100%;
  border-bottom: 1px solid rgba(24, 31, 67, 0.12);
  .edit_header {
    width: 100%;
    .steps {
      width: 220px;
      display: flex;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .step {
        height: 64px;
        line-height: 64px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(24, 31, 67, 0.5);
        .number {
          font-size: 18px;
          font-weight: bold;
          margin-right: 4px;
        }
        &.active {
          color: rgba(24, 31, 67, 0.95);
          border-bottom: 5px solid #4c5cdb;
        }
      }
      .separator {
        width: 16px;
        height: 64px;
        line-height: 64px;
        text-align: center;
        font-size: 12px;
        color: #818a9e;
        margin: 0 12px;
        .iconfont {
          position: relative;
          top: 2px;
        }
      }
    }
    .operation {
      display: flex;
      position: absolute;
      right: 0;
      height: 64px;
      line-height: 64px;
      .iconfont {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        color: #818a9e;
        margin-top: 22px;
        margin-right: 24px;
        cursor: pointer;
      }
      .prev {
        width: 74px;
        margin-top: 12px;
        margin-right: 12px;
      }
      .save {
        width: 60px;
        margin-top: 12px;
        margin-right: 12px;
        border-radius: 3px;
        border: 1px solid rgba(76, 92, 219, 0.85);
        font-size: 14px;
        font-weight: 400;
        color: #4c5cdb;
      }
      .next {
        width: 74px;
        margin-top: 12px;
        margin-right: 24px;
        border-radius: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
      }
      .publish {
        width: 74px;
        margin-top: 12px;
        margin-right: 24px;
        border-radius: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        .iconfont {
          position: relative;
          right: 4px;
          margin: 0;
          color: #fff;
          font-size: 16px;
        }
      }
    }
  }
`;

type ConfigItem = { [k: string]: string | number | boolean | null | undefined | Object | Array<any> };
type ComponentConfig = {
  config: ConfigItem;
  props?: ConfigItem;
};
type Event = {
  fieldId: string;
  value: string | number | boolean | string[];
  listeners: {
    visible: string[];
    reset: string[];
  };
};
type Events = {
  onChange: Event[];
};
type Rule = {
  type: string;
  field: string;
};
type Theme = {
  name: string;
};
type FormDesign = {
  selectedTheme?: string;
  components: ComponentConfig[];
  layout: string[][];
  events?: Events;
  schema: { [k: string]: SchemaItem };
  rules?: Rule[];
  themes?: Theme[];
};

const EditorHeader: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { bpmId } = useParams<{ bpmId: string }>();
  const match = useRouteMatch();
  const location = useLocation();
  const pathName = useMemo(() => {
    return location.pathname;
  }, [location]);
  const flowDesignPath = `${match.url}/flow-design`;
  const handlePreview = useCallback(() => {
    if (pathName === '/form-design') {
      history.push('/preview-form');
    }
  }, [pathName, history]);
  const handlePrev = useCallback(() => {
    if (pathName === '/flow-design') {
      history.push('/form-design');
    }
  }, [pathName, history]);
  const handleSave = useCallback(() => {
    if (pathName === '/form-design') {
      const { formDesign } = store.getState();
      const { layout, schema } = formDesign;
      const designData: FormDesign = {
        components: [],
        layout: layout,
        schema: schema,
      };
      const { byId } = formDesign;
      Object.keys(byId).forEach((id) => {
        const type = id.split('_')[0] || '';
        const version = schema[type as FieldType]?.baseInfo.version || '';
        const componentConfig = schema[type as FieldType]?.config;
        const config: ConfigItem = { id, type, version, rules: [], canSubmit: type === 'DescText' ? false : true };
        const props: ConfigItem = {};
        componentConfig?.forEach(({ isProps, key }) => {
          if (isProps) {
            props[key] = (byId[id] as any)[key];
          } else {
            config[key] = (byId[id] as any)[key];
          }
        });
        designData.components.push({ config, props });
      });
    }

    if (pathName === flowDesignPath) {
      dispatch(save(bpmId));
    }
  }, [pathName, dispatch, flowDesignPath, bpmId]);
  const handleNext = useCallback(() => {
    if (pathName === '/form-design') {
      history.push('/flow-design');
    }
  }, [pathName, history]);

  const handlePublish = useCallback(async () => {
    await axios.post('/subapp/deploy', {
      enableNewVersion: true,
      remark: '',
      subappId: bpmId,
    });

    message.success('发布成功');
  }, [bpmId]);

  return (
    <HeaderContainer>
      <Header backText="燃气报修" className="edit_header">
        <div className="steps">
          <NavLink className="step" to={`${match.url}/form-design`} activeClassName="active">
            <span className="number">01</span>
            <span>表单设计</span>
          </NavLink>
          <div className="separator">
            <Icon className="iconfont" type="jinru" />
          </div>
          <NavLink className="step" to={`${match.url}/flow-design`} activeClassName="active">
            <span className="number">02</span>
            <span>流程设计</span>
          </NavLink>
        </div>
        <div className="operation">
          {/* 这个版本暂时不做 */}
          {/* 
            <Icon className="iconfont" type="jiantoushangyibu" />
            <Icon className="iconfont" type="jiantouxiayibu" />
          */}
          {pathName === '/form-design' && (
            <Tooltip title="预览">
              <Icon className="iconfont" type="yulan" onClick={handlePreview} />
            </Tooltip>
          )}
          {pathName === '/flow-design' && (
            <Button className="prev" size="large" onClick={handlePrev}>
              上一步
            </Button>
          )}
          <Button type="primary" ghost className="save" size="large" onClick={handleSave}>
            保存
          </Button>
          {pathName === '/form-design' && (
            <Button type="primary" className="next" size="large" onClick={handleNext}>
              下一步
            </Button>
          )}
          {pathName === `${match.url}/flow-design` && (
            <AsyncButton
              className="publish"
              type="primary"
              size="large"
              icon={<Icon className="iconfont" type="fabu" />}
              onClick={handlePublish}
            >
              发布
            </AsyncButton>
          )}
        </div>
      </Header>
    </HeaderContainer>
  );
};

export default memo(EditorHeader);
