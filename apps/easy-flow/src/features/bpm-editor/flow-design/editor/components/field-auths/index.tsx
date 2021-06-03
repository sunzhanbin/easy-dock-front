import { memo, useMemo } from 'react';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { FieldAuthsMap, AuthType } from '../../../types';
import styles from './index.module.scss';

type FieldAuth = { id: string; auth: AuthType; name: string };

interface FieldRowProps {
  value: FieldAuth;
  onChange(field: FieldAuth): void;
  extra?: {
    [key in 'view' | 'edit' | 'required']: {
      label: string;
      indeterminate: boolean;
    };
  };
  className?: string;
}

const FieldRow = memo(function FieldRow(props: FieldRowProps) {
  const { value, onChange, extra, className } = props;
  const handleAuthChange = useMemoCallback((auth: FieldAuth['auth']) => {
    onChange(Object.assign({}, value, { auth }));
  });

  return (
    <div className={classnames(styles['flex-row'], className)}>
      <div className={styles.cell}>{value.name}</div>
      <div className={styles.cell}>
        <span className={styles.checkbox} onClickCapture={() => handleAuthChange(value.auth > 0 ? 0 : 1)}>
          <Checkbox checked={value.auth > 0} indeterminate={extra?.view.indeterminate} />
          {extra?.view.label && <span className={styles.label}>{extra.view.label}</span>}
        </span>
      </div>
      <div className={styles.cell}>
        <span className={styles.checkbox} onClickCapture={() => handleAuthChange(value.auth > 1 ? 1 : 2)}>
          <Checkbox checked={value.auth > 1} indeterminate={extra?.edit.indeterminate} />
          {extra?.edit.label && <span className={styles.label}>{extra.edit.label}</span>}
        </span>
      </div>
      <div className={styles.cell}>
        <span className={styles.checkbox} onClickCapture={() => handleAuthChange(value.auth === 3 ? 2 : 3)}>
          <Checkbox checked={value.auth === 3} indeterminate={extra?.required.indeterminate} />
          {extra?.required.label && <span className={styles.label}>{extra.required.label}</span>}
        </span>
      </div>
    </div>
  );
});

interface FieldAuthsProps {
  value?: FieldAuthsMap;
  onChange?(value: this['value']): void;
  templates: FieldAuth[];
}

function FieldAuths(props: FieldAuthsProps) {
  const { value, onChange, templates } = props;
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

    let viewAuthNum = 0;
    let editAuthNum = 0;
    let requiredAuthNum = 0;
    let totalAuth: FieldAuth['auth'] = 0;

    templates.forEach((field) => {
      if (value && value[field.id]) {
        valueMaps[field.id] = {
          id: field.id,
          name: field.name,
          auth: value[field.id],
        };
      } else {
        valueMaps[field.id] = {
          id: field.id,
          name: field.name,
          auth: 1,
        };
      }

      const auth = valueMaps[field.id].auth;

      if (auth === 1) {
        viewAuthNum++;
      } else if (auth === 2) {
        editAuthNum++;
        viewAuthNum++;
      } else if (auth === 3) {
        editAuthNum++;
        viewAuthNum++;
        requiredAuthNum++;
      }
    });

    statistic.view.indeterminate = viewAuthNum > 0 && viewAuthNum < templates.length;
    statistic.edit.indeterminate = editAuthNum > 0 && editAuthNum < templates.length;
    statistic.required.indeterminate = requiredAuthNum > 0 && requiredAuthNum < templates.length;

    if (requiredAuthNum === templates.length) {
      totalAuth = 3;
    } else if (editAuthNum === templates.length) {
      totalAuth = 2;
    } else if (viewAuthNum === templates.length) {
      totalAuth = 1;
    }

    return {
      valueMaps,
      total: {
        value: {
          name: '字段名称',
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

    for (let key in newValue) {
      newValue[key] = auth;
    }

    if (onChange) {
      onChange(newValue);
    }
  });

  return (
    <div>
      <FieldRow className={styles.title} value={total.value} extra={total.extra} onChange={handleTotalChange} />
      {templates.map((field) => {
        return <FieldRow key={field.id} value={valueMaps[field.id]} onChange={handleFieldChange} />;
      })}
    </div>
  );
}

export default memo(FieldAuths);
