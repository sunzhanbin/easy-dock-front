import { memo, useMemo } from 'react';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { FieldAuthsMap, AuthType, FieldTemplate } from '@type/flow';
import useFieldsTemplate from '../../../hooks/use-fields-template';
import styles from './index.module.scss';

type FieldAuth = Pick<FieldTemplate, 'id'> & { auth: AuthType };

interface FieldRowProps {
  label: string;
  value: FieldAuth;
  onChange(field: FieldAuth): void;
  extra?: {
    [key in 'view' | 'edit' | 'required']: {
      label: string;
      indeterminate: boolean;
    };
  };
  className?: string;
  max?: FieldAuth['auth'];
}

const FieldRow = memo(function FieldRow(props: FieldRowProps) {
  const { value, onChange, extra, label, className, max = AuthType.Required } = props;
  const handleAuthChange = useMemoCallback((auth: FieldAuth['auth']) => {
    onChange(Object.assign({}, value, { auth }));
  });

  return (
    <div className={classnames(styles['flex-row'], max !== AuthType.Required ? styles.limit : '', className)}>
      <div className={styles.cell}>{label}</div>
      <div className={styles.cell}>
        <span className={styles.checkbox} onClickCapture={() => handleAuthChange(value.auth > 0 ? 0 : 1)}>
          <Checkbox checked={value.auth > 0} indeterminate={extra?.view.indeterminate} />
          {extra?.view.label && <span className={styles.label}>{extra.view.label}</span>}
        </span>
      </div>

      {max > 1 && (
        <div className={styles.cell}>
          <span className={styles.checkbox} onClickCapture={() => handleAuthChange(value.auth > 1 ? 1 : 2)}>
            <Checkbox checked={value.auth > 1} indeterminate={extra?.edit.indeterminate} />
            {extra?.edit.label && <span className={styles.label}>{extra.edit.label}</span>}
          </span>
        </div>
      )}
      {max > 2 && (
        <div className={styles.cell}>
          <span className={styles.checkbox} onClickCapture={() => handleAuthChange(value.auth === 3 ? 2 : 3)}>
            <Checkbox checked={value.auth === 3} indeterminate={extra?.required.indeterminate} />
            {extra?.required.label && <span className={styles.label}>{extra.required.label}</span>}
          </span>
        </div>
      )}
    </div>
  );
});

interface FieldAuthsProps {
  max?: FieldAuth['auth'];
  value?: FieldAuthsMap;
  onChange?(value: this['value']): void;
  templates: FieldTemplate[];
}

function FieldAuths(props: FieldAuthsProps) {
  const { value, onChange, max = AuthType.Required } = props;
  const templates = useFieldsTemplate();

  const memoValueInfo = useMemo(() => {
    const valueMaps: { [key: string]: FieldAuth } = {};
    const statistic: FieldRowProps['extra'] = {
      view: {
        label: '查看',
        indeterminate: false,
      },
      edit: {
        label: '编辑',
        indeterminate: false,
      },
      required: {
        label: '必填',
        indeterminate: false,
      },
    };

    // 可见字段数量
    let viewAuthNum = 0;
    // 可编辑字段数量
    let editAuthNum = 0;
    // 必填字段数量
    let requiredAuthNum = 0;
    // 统计的权限
    let totalAuth: FieldAuth['auth'] = 0;
    // 统计只能有AuthType.View的字段总数
    let viewTypeNum = 0;

    templates.forEach((field) => {
      let fieldauth: AuthType;

      if (field.type === 'DescText') {
        viewTypeNum++;
      }

      if (value && value[field.id] in AuthType) {
        fieldauth = value[field.id];
      } else {
        fieldauth = AuthType.View;
      }

      valueMaps[field.id] = {
        id: field.id,
        auth: fieldauth,
      };

      const auth = valueMaps[field.id].auth;

      if (auth === AuthType.View) {
        viewAuthNum++;
      } else if (auth === AuthType.Edit) {
        editAuthNum++;
        viewAuthNum++;
      } else if (auth === AuthType.Required) {
        editAuthNum++;
        viewAuthNum++;
        requiredAuthNum++;
      }
    });

    const totalViewNum = templates.length;
    const totalEditableNum = templates.length - viewTypeNum;
    const totalRequiredNum = templates.length - viewTypeNum;

    statistic.view.indeterminate = viewAuthNum > 0 && viewAuthNum < totalViewNum;
    statistic.edit.indeterminate = editAuthNum > 0 && editAuthNum < totalEditableNum;
    statistic.required.indeterminate = requiredAuthNum > 0 && requiredAuthNum < totalRequiredNum;

    if (requiredAuthNum === totalRequiredNum) {
      totalAuth = 3;
    } else if (editAuthNum === totalEditableNum) {
      totalAuth = 2;
    } else if (viewAuthNum === totalViewNum) {
      totalAuth = 1;
    }

    return {
      valueMaps,
      total: {
        value: {
          id: '',
          auth: totalAuth,
        },
        extra: statistic,
      },
    };
  }, [value, templates]);

  const handleFieldChange = useMemoCallback((field: FieldAuth) => {
    if (!onChange) return;

    onChange(Object.assign({}, value, { [field.id]: field.auth }));
  });

  const { valueMaps, total } = memoValueInfo;

  const handleTotalChange = useMemoCallback((field: FieldAuth) => {
    const { auth } = field;
    const newValue = { ...value };

    templates.forEach((field) => {
      if (field.type === 'DescText') {
        newValue[field.id] = Math.min(auth, AuthType.View);
      } else {
        newValue[field.id] = auth;
      }
    });

    if (onChange) {
      onChange(newValue);
    }
  });

  return (
    <div>
      <FieldRow
        label="字段名称"
        max={max}
        className={styles.title}
        value={total.value}
        extra={total.extra}
        onChange={handleTotalChange}
      />

      {templates.map((field) => {
        return (
          <FieldRow
            label={field.name || '描述文字'}
            className={classnames({
              // 当字段是描述文字的时候并且字段列表可配编辑和必填时让描述文字的复选框显示only-view
              // 右侧会空出空间与其他字段对齐
              [styles['only-view']]: field.type === 'DescText' && max === AuthType.Required,
            })}
            max={field.type === 'DescText' ? 1 : max}
            key={field.id}
            value={valueMaps[field.id]}
            onChange={handleFieldChange}
          />
        );
      })}
    </div>
  );
}

export default memo(FieldAuths);
