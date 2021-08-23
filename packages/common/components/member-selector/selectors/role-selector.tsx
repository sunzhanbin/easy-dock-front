import { memo, useState, useEffect, useContext, useMemo } from 'react';
import { Checkbox, Input } from 'antd';
import { debounce } from 'lodash';
import { fetchRoles } from '../util';
import { Role } from '../type';
import Layout from './layout';
import DataContext from '../context';
import useMemoCallback from '../../../hooks/use-memo-callback';
import styles from '../index.module.scss';

interface RoleSelectorProps {
  value?: Role[];
  onChange?(value: this['value']): void;
}

function RoleSelector(props: RoleSelectorProps) {
  const { value, onChange } = props;
  const [keyword, setKeyword] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const { projectId } = useContext(DataContext)!;

  const valueMap = useMemo(() => {
    if (!value) return {};

    return value.reduce((curr, next) => ({ ...curr, [next.id]: true }), {} as { [roleId: string]: boolean });
  }, [value]);

  useEffect(() => {
    if (!projectId) return;

    fetchRoles(projectId).then((data) => {
      setRoles(data);
    });
  }, [projectId]);

  const handleRoleChange = useMemoCallback((role: Role, selected: boolean) => {
    if (!onChange) return;

    let newRoles = value ? [...value] : [];

    if (selected) {
      newRoles.push(role);
    } else {
      newRoles = newRoles.filter((item) => item.id !== role.id);
    }

    onChange(newRoles);
  });

  const handleKeywordChange = useMemoCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      setKeyword(inputValue.trim());
    }, 300),
  );

  const showRoles = useMemo(() => {
    if (!keyword) return roles;

    return roles.filter((role) => role.name.indexOf(keyword) > -1);
  }, [roles, keyword]);

  return (
    <Layout className={styles.selector} onKeywordChange={setKeyword} keywordPlaceholder="搜索角色">
      <div className={styles.list}>
        {showRoles.map((role) => {
          const selected = valueMap[role.id];

          return (
            <div className={styles.item} onClick={() => handleRoleChange(role, !selected)} key={role.id}>
              <span className={styles.name}>{role.name}</span>
              <Checkbox checked={selected} />
            </div>
          );
        })}
      </div>

      {showRoles.length === 0 && <div>未搜索到角色</div>}
    </Layout>
  );
}

export default memo(RoleSelector);
