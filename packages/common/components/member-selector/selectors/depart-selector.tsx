import { memo, useState, useMemo, useEffect, useContext } from 'react';
import classnames from 'classnames';
import { Tree, Input } from 'antd';
import { filterOptions } from 'rc-tree-select/es/utils/valueUtil';
import { Loading } from '../../../components';
import useMemoCallback from '../../../hooks/use-memo-callback';
import SelectorContext from '../context';
import { ValueType, TreeData, Key } from '../type';
import { fetchDepts, treeDataMap, excludeTreeChildren } from '../util';
import styles from '../index.module.scss';

interface DeptSelectorProps {
  value?: ValueType['depts'];
  onChange?(value: NonNullable<this['value']>): void;
  strict?: boolean;
}

function DeptSelector(props: DeptSelectorProps) {
  const [treeData, setTreeData] = useState<TreeData>([]);
  const { value, onChange, strict } = props;
  const { wrapperClass, projectId } = useContext(SelectorContext)!;
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>([]);
  // const showTreeData = useMemo(() => {
  //   if (!keyword) return treeData;

  //   return filterOptions(keyword, treeData, { optionFilterProp: 'title', filterOption: true }) as TreeData;
  // }, [keyword, treeData]);

  const handleExpand = useMemoCallback((expandedKeys: Key[]) => {
    setTreeExpandedKeys(expandedKeys);
  });

  const keyNodeMap = useMemo(() => {
    return treeDataMap(treeData, {});
  }, [treeData]);

  const searchExpandedKeys = useMemo(() => {
    return Object.keys(keyNodeMap).map(Number);
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

  const handleNodeCheck = useMemoCallback((value: { checked: Key[]; halfChecked: Key[] } | Key[], event: any) => {
    let checkeds: Key[];

    if (Array.isArray(value)) {
      checkeds = value;
    } else {
      checkeds = value.checked;
    }

    if (!strict) {
      checkeds = excludeTreeChildren(treeData, checkeds);
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
          treeData={treeData}
          blockNode
          selectable={false}
          virtual={false}
          checkStrictly={strict}
          onExpand={handleExpand}
          expandedKeys={keyword ? searchExpandedKeys : treeExpandedKeys}
          onCheck={handleNodeCheck}
          checkedKeys={checkedKeys}
          filterTreeNode={(node) => {
            return String(node.title).indexOf(keyword!) > -1;
          }}
        />
      ) : null}
      {treeData.length === 0 && <div>未搜索到部门</div>}
      {loading && <Loading className={styles.loading} />}
    </div>
  );
}

export default memo(DeptSelector);
