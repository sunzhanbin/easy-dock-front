import { FC, memo, useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { Icon, Loading } from "@common/components";
import { useAppSelector } from "@/app/hooks";
import {
  componentPropsSelector,
  propertyRulesSelector,
  formRulesSelector,
  layoutSelector,
  subAppSelector,
} from "@/features/bpm-editor/form-design/formzone-reducer";
import FormEngine from "@components/form-engine";
import { Datasource, FormMeta } from "@type/detail";
import { AuthType, FieldAuthsMap } from "@type/flow";
import { ComponentConfig, FormField, FormFieldMap, InputField, InputNumberField, RadioField } from "@/type";
import { fetchDataSource } from "@/apis/detail";
import { useSubAppDetail } from "@/app/app";
import classnames from "classnames";
import titleImage from "@/assets/title.png";
import styles from "./index.module.scss";
import appConfig from "@/init";
import { useLocation } from "react-router-dom";
import useMemoCallback from "@common/hooks/use-memo-callback";

const propsKey = [
  "defaultValue",
  "showSearch",
  "multiple",
  "format",
  "datelimit",
  "numlimit",
  "maxCount",
  "height",
  "components",
  "fieldName",
  "decimal",
  "fileMap",
  "defaultNumber",
  "url",
];
type Key = keyof FormField;

const PreviewModal: FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const location = useLocation();
  const { name: appName } = useAppSelector(subAppSelector);
  const layout = useAppSelector(layoutSelector);
  const byId: FormFieldMap = useAppSelector(componentPropsSelector);
  const formRules = useAppSelector(formRulesSelector);
  const propertyRules = useAppSelector(propertyRulesSelector);
  const [dataSource, setDataSource] = useState<Datasource>({});
  const [loading, setLoading] = useState<boolean>(false);
  const subAppDetail = useSubAppDetail();
  const projectId = useMemo(() => {
    if (subAppDetail && subAppDetail.data && subAppDetail.data.app) {
      return subAppDetail.data.app.project.id;
    }
  }, [subAppDetail]);

  const formDesign = useMemo(() => {
    const components: ComponentConfig[] = [];
    Object.keys(byId).forEach((id) => {
      const object = byId[id];
      const type = object.type;
      const component: ComponentConfig = { config: { type, id }, props: { type, id } };
      Object.keys(object).forEach((key) => {
        if (propsKey.includes(key)) {
          component.props[key] = object[key as Key];
        } else {
          component.config[key] = object[key as Key];
          if (type === "Image" || type === "Attachment") {
            component.props[key] = object[key as Key];
          }
        }
      });
      components.push(component);
    });
    return {
      layout,
      events: {
        onchange: [],
      },
      rules: [],
      formRules,
      propertyRules,
      themes: [{}],
      components: components,
      selectedTheme: "",
    };
  }, [layout, byId, formRules, propertyRules]);
  const auths = useMemo(() => {
    const res: FieldAuthsMap = {};
    Object.keys(byId).forEach((id) => {
      const { fieldName = "" } = byId[id];
      res[fieldName || id] = AuthType.Edit;
    });
    return res;
  }, [byId]);
  const initialValue = useMemo(() => {
    const value: { [key: string]: any } = {};
    Object.keys(byId).forEach((id) => {
      const config = byId[id];
      const { defaultValue } = config as InputField | InputNumberField;
      if (defaultValue || defaultValue === 0) {
        value[config.fieldName] = defaultValue;
      }
    });
    return value;
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
  const theme = useMemo<string>(() => {
    // 以iframe方式接入,参数在location中
    if (location.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get("theme") || "light";
    }
    // 以微前端方式接入,参数在extra中
    if (appConfig?.extra?.theme) {
      return appConfig.extra.theme;
    }
    return "light";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, appConfig?.extra?.theme]);

  const backgroundImage = useMemoCallback((position) => {
    const publicPath = appConfig.publicPath.replace(/\/$/, "");
    return `${publicPath}/images/flow-detail/${theme}-${position}.png`;
  });
  useEffect(() => {
    const components = Object.values(byId).filter((component) => {
      const { type } = component;
      return type === "Radio" || type === "Checkbox" || type === "Select";
    });
    const formDataList: { name: string; value: any }[] = Object.keys(initialValue).map((key) => ({
      name: key,
      value: initialValue[key],
    }));
    setLoading(true);
    fetchDataSource(components as RadioField[], formDataList)
      .then((res) => {
        setDataSource(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [byId, initialValue]);
  return (
    <Modal
      visible={visible}
      title={title}
      footer={null}
      onCancel={onClose}
      wrapClassName={styles.container}
      destroyOnClose={true}
    >
      {loading && <Loading className={styles.loading} />}
      <div className="content">
        <div className={styles.background}>
          <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage("left")})` }} />
          <div className={styles.right} style={{ backgroundImage: `url(${backgroundImage("right")})` }} />
        </div>
        <div className={styles["start-form-wrapper"]}>
          <div className={classnames(styles.form)} style={{ height: `${document.body.clientHeight - 124}px` }}>
            <div className={styles.title}>
              <img src={titleImage} alt="title" className={styles.image} />
              <span>{appName}</span>
            </div>
            <div className={styles["form-wrap"]}>
              <FormEngine
                datasource={dataSource}
                initialValue={initialValue}
                data={formDesign as unknown as FormMeta}
                fieldsAuths={auths}
                className={styles["form-engine"]}
                projectId={projectId}
                nodeType="preview"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(PreviewModal);
