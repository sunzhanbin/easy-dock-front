import { memo, useMemo, useContext, useEffect, useState } from 'react';
import { Checkbox, Tree } from 'antd';
import classnames from 'classnames';
import Layout from './layout';
import DataContext from '../context';
import { DynamicFields, Role, ValueType, Key } from '../type';
import { fetchRoles } from '../util';
import useMemoCallback from '../../../hooks/use-memo-callback';
import styles from '../index.module.scss';

interface DynamicSelectorProps {
  fields?: DynamicFields;
  value?: ValueType['dynamic'];
  onChange?(value: this['value']): void;
}

function DynamicSelector(props: DynamicSelectorProps) {
  const { fields, value, onChange } = props;
  const { projectId } = useContext(DataContext)!;
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (!projectId) return;

    fetchRoles(projectId).then((data) => {
      setRoles(data);
    });
  }, [projectId]);

  const treeRoles = useMemo(() => {
    return [
      {
        title: '发起人所属部门的角色',
        key: 'ALL',
        checkable: false,
        children: roles.map((role) => ({
          title: role.name,
          key: role.id,
        })),
      },
    ];
  }, [roles]);

  const formMemberFields = useMemo(() => {
    return [
      {
        title: '表单中人员控件的值',
        key: 'ALL_MEMBER_FIELD_IN_FORM',
        checkable: false,
        children: (fields || []).map((field) => ({ title: field.name, key: field.key })),
      },
    ];
  }, [fields]);

  const handleStarterChange = useMemoCallback(() => {
    if (onChange) {
      const starter = value?.starter;

      onChange(Object.assign({}, value, { starter: !starter }));
    }
  });

  const choosedRoles = useMemo(() => {
    const roles = value?.roles || [];
    return roles.map((role) => role.id);
  }, [value?.roles]);

  const handleRolesChange = useMemoCallback((treeValue: { checked: Key[]; halfChecked: Key[] } | Key[]) => {
    let checkeds: Key[];

    if (Array.isArray(treeValue)) {
      checkeds = treeValue;
    } else {
      checkeds = treeValue.checked;
    }

    const rolesMap = roles.reduce((curr, next) => {
      curr[next.id] = next;
      return curr;
    }, {} as { [key: string]: Role });

    if (onChange) {
      onChange(Object.assign({}, value, { roles: checkeds.map((item) => rolesMap[item]) }));
    }
  });

  const choosedFields = useMemo(() => {
    const fields = value?.fields || [];

    return fields.map((field) => field.key);
  }, [value?.fields]);

  const handleFieldsChange = useMemoCallback((fieldsValue: { checked: Key[]; halfChecked: Key[] } | Key[]) => {
    let checkeds: Key[];

    if (Array.isArray(fieldsValue)) {
      checkeds = fieldsValue;
    } else {
      checkeds = fieldsValue.checked;
    }

    const fieldsMap = (fields || []).reduce((curr, next) => {
      curr[next.key] = next;
      return curr;
    }, {} as { [key: string]: DynamicFields[number] });

    if (onChange) {
      onChange(Object.assign({}, value, { fields: checkeds.map((item) => fieldsMap[item]) }));
    }
  });

  return (
    <Layout onKeywordChange={() => {}} keywordPlaceholder="搜索动态">
      <div className={styles.list}>
        <div className={classnames(styles.item, styles.starter)} onClick={handleStarterChange}>
          <span className={styles.name}>发起人</span>
          <Checkbox checked={value?.starter} />
        </div>

        <Tree
          className={classnames(styles.tree)}
          checkable
          treeData={treeRoles}
          blockNode
          selectable={false}
          virtual={false}
          checkedKeys={choosedRoles}
          onCheck={handleRolesChange}
          defaultExpandAll
          checkStrictly
        />

        <Tree
          className={classnames(styles.tree, !fields || fields.length === 0 ? styles['dynamic-empty-fields'] : '')}
          checkable
          treeData={formMemberFields}
          blockNode
          selectable={false}
          virtual={false}
          onCheck={handleFieldsChange}
          checkedKeys={choosedFields}
          defaultExpandAll
        />
      </div>
    </Layout>
  );
}

export default memo(DynamicSelector);
