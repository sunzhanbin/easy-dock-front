import { memo, useState, useMemo, useEffect, useContext } from 'react';
import classnames from 'classnames';
import { Tree, Input } from 'antd';
import { filterOptions } from 'rc-tree-select/es/utils/valueUtil';
import { Loading } from '../../../components';
import useMemoCallback from '../../../hooks/use-memo-callback';
import SelectorContext from '../context';
import { axios } from '../util';
import { ValueType } from '../type';
import styles from '../index.module.scss';

type TreeData = {
  title: string;
  key: string | number;
  children?: TreeData;
}[];

interface DeptSelectorProps {
  value?: ValueType['depts'];
  onChange?(value: NonNullable<this['value']>): void;
  strict?: boolean;
}

type Key = string | number;

function treeDataMap(data: TreeData, map: { [key: string]: TreeData[number] }) {
  data.forEach((node) => {
    map[node.key] = node;

    if (node.children && node.children.length) {
      treeDataMap(node.children, map);
    }
  });

  return map;
}

type DeptsResponse = {
  id: number;
  name: string;
  children?: DeptsResponse;
}[];

async function fetchDepts(projectId: number | string): Promise<TreeData> {
  const { data } = await axios.get<{ data: DeptsResponse }>(`/dept/list/all/${projectId}`);

  function formatTreeData(data?: DeptsResponse): TreeData {
    if (!data) return [];

    const treeData: TreeData = [];

    data.forEach((item) => {
      treeData.push({
        key: item.id,
        title: item.name,
        children: formatTreeData(item.children),
      });
    });

    return treeData;
  }

  return formatTreeData(data);
}

function DeptSelector(props: DeptSelectorProps) {
  const [treeData, setTreeData] = useState<TreeData>([]);
  const { value, onChange, strict } = props;
  const { wrapperClass, projectId } = useContext(SelectorContext)!;
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>([]);
  const showTreeData = useMemo(() => {
    if (!keyword) return treeData;
    return filterOptions(keyword, treeData, { optionFilterProp: 'name', filterOption: true }) as TreeData;
  }, [keyword, treeData]);

  const handleExpand = useMemoCallback((expandedKeys: Key[]) => {
    setTreeExpandedKeys(expandedKeys);
  });

  const keyNodeMap = useMemo(() => {
    return treeDataMap(treeData, {});
  }, [treeData]);

  const searchExpandedKeys = useMemo(() => {
    return Object.keys(keyNodeMap);
  }, [keyNodeMap]);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);

    fetchDepts(projectId)
      .then((data) => {
        setTreeData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]);

  useEffect(() => {
    if (value) {
      setTreeExpandedKeys((keys) => {
        const newKeys = keys.concat(value.map((item) => item.id));

        return Array.from(new Set(newKeys));
      });
    }
  }, [value]);

  const checkedKeys = useMemo(() => {
    if (!value) return [];

    return value.map((item) => item.id);
  }, [value]);

  const handleNodeCheck = useMemoCallback((value: { checked: Key[]; halfChecked: Key[] } | Key[]) => {
    let checkeds: Key[];

    if (Array.isArray(value)) {
      checkeds = value;
    } else {
      checkeds = value.checked;
    }

    if (onChange) {
      onChange(
        checkeds.map((item) => {
          return {
            id: keyNodeMap[item].key,
            name: keyNodeMap[item].title,
          };
        }),
      );
    }
  });

  const handleNodeSelect = useMemoCallback((selectedKeys: Key[]) => {
    if (!onChange || !selectedKeys.length) return;

    const [key] = selectedKeys;
    const val = value || [];
    const keyInValueIndex = val.findIndex((item) => item.id === key);

    if (keyInValueIndex === -1) {
      onChange(
        val.concat({
          id: key,
          name: keyNodeMap[key].title,
        }),
      );
    } else {
      onChange(val.slice(0, keyInValueIndex).concat(val.slice(keyInValueIndex + 1)));
    }
  });

  return (
    <div className={classnames(styles.selector, wrapperClass)}>
      <Input
        className={styles.search}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        size="large"
        placeholder="搜索部门"
      />

      {treeData.length ? (
        <Tree
          className={styles.list}
          checkable
          treeData={showTreeData}
          blockNode
          virtual={false}
          checkStrictly={strict}
          onExpand={handleExpand}
          expandedKeys={keyword ? searchExpandedKeys : treeExpandedKeys}
          onCheck={handleNodeCheck}
          onSelect={handleNodeSelect}
          checkedKeys={checkedKeys}
        />
      ) : null}

      {loading && <Loading className={styles.loading} />}
    </div>
  );
}

export default memo(DeptSelector);
