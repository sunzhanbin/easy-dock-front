import { memo, useMemo } from 'react';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import { Text } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { FieldAuthsMap, AuthType, FieldTemplate } from '@type/flow';
import useFieldsTemplate from '../../hooks/use-fields-template';
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
      <Text placement="topLeft" className={styles.cell}>
        {label}
      </Text>

      <div className={styles.cell}>
        <Checkbox
          checked={value.auth > AuthType.Denied && !extra?.view.indeterminate}
          indeterminate={extra?.view.indeterminate}
          onChange={(event) => handleAuthChange(event.target.checked ? 1 : 0)}
        >
          {extra?.view.label}
        </Checkbox>
      </div>

      {max > 1 && (
        <div className={styles.cell}>
          <Checkbox
            checked={value.auth > AuthType.View}
            indeterminate={extra?.edit.indeterminate}
            onChange={(event) => handleAuthChange(event.target.checked ? 2 : 1)}
          >
            {extra?.edit.label}
          </Checkbox>
        </div>
      )}
      {max > 2 && (
        <div className={styles.cell}>
          <Checkbox
            checked={value.auth > AuthType.Edit}
            indeterminate={extra?.required.indeterminate}
            onChange={(event) => handleAuthChange(event.target.checked ? 3 : 2)}
          >
            {extra?.required.label}
          </Checkbox>
        </div>
      )}
    </div>
  );
});

interface FieldAuthsProps {
  max?: FieldAuth['auth'];
  value?: FieldAuthsMap;
  onChange?(value: this['value']): void;
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
      const { type, id, parentId } = field;

      if (['DescText', 'SerialNum','FlowData'].includes(type)) {
        viewTypeNum++;
      }
      let auth: AuthType = AuthType.View;
      if (parentId) {
        if (value && ((value[parentId] as FieldAuthsMap)[id] as AuthType) in AuthType) {
          auth = ((value[parentId] as FieldAuthsMap)[id] as AuthType) ?? AuthType.View;
        }
      } else {
        if (value && (value[id] as AuthType) in AuthType) {
          auth = (value[id] as AuthType) ?? AuthType.View;
        }
      }

      valueMaps[id] = {
        id,
        auth,
      };

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
    const template = templates.find((v) => v.id === field.id);
    const parentId = template?.parentId;
    if (parentId && value) {
      const parentAuth = Object.assign({}, value[parentId], { [field.id]: field.auth });
      onChange(Object.assign({}, value, { [parentId]: parentAuth }));
      return;
    }
    onChange(Object.assign({}, value, { [field.id]: field.auth }));
  });

  const { valueMaps, total } = memoValueInfo;

  const handleTotalChange = useMemoCallback((field: FieldAuth) => {
    const { auth } = field;
    const newValue = { ...value };
    templates.forEach((field) => {
      const { id, parentId, type } = field;
      if (parentId) {
        const parentAuth = Object.assign({}, newValue[parentId], {
          [id]: ['DescText', 'SerialNum','FlowData'].includes(type) ? Math.min(auth, AuthType.View) : auth,
        });
        newValue[parentId] = Object.assign({}, newValue[parentId], parentAuth);
        return;
      }
      if (['DescText', 'SerialNum','FlowData'].includes(type)) {
        newValue[id] = Math.min(auth, AuthType.View);
      } else {
        newValue[id] = auth;
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
        const { id, parentId } = field;
        let fieldAuth: FieldAuth = valueMaps[id];
        if (parentId && value && value[parentId] !== undefined) {
          fieldAuth = { id, auth: (value[parentId] as FieldAuthsMap)[id] as AuthType };
        } else {
          fieldAuth = valueMaps[id];
        }
        return (
          <FieldRow
            label={field.name || '描述文字'}
            className={classnames({
              // 当字段是描述文字的时候并且字段列表可配编辑和必填时让描述文字的复选框显示only-view
              // 右侧会空出空间与其他字段对齐
              [styles['only-view']]: ['DescText', 'SerialNum','FlowData'].includes(field.type) && max === AuthType.Required,
            })}
            max={['DescText', 'SerialNum','FlowData'].includes(field.type) ? 1 : max}
            key={field.id}
            value={fieldAuth}
            onChange={handleFieldChange}
          />
        );
      })}
    </div>
  );
}

export default memo(FieldAuths);
