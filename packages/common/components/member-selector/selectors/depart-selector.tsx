import { memo, useState, useMemo, useEffect, useContext } from 'react';
import classnames from 'classnames';
import { Tree, Input } from 'antd';
import { Loading } from '../../../components';
import { debounce } from 'lodash';
import useMemoCallback from '../../../hooks/use-memo-callback';
import SelectorContext from '../context';
import { ValueType, TreeData, Key } from '../type';
import { fetchDepts, treeDataMap, excludeTreeChildren, filterTreeData } from '../util';
import styles from '../index.module.scss';

interface DeptSelectorProps {
  value?: ValueType['depts'];
  onChange?(value: NonNullable<this['value']>): void;
  strict?: boolean;
}

function DeptSelector(props: DeptSelectorProps) {
  const { value, onChange, strict } = props;
  const { wrapperClass, projectId } = useContext(SelectorContext)!;
  const [treeData, setTreeData] = useState<TreeData>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>((value || []).map((item) => item.id));
  const [searchExpandedKeys, setSearchExpandedKeys] = useState<Key[]>([]);
  const handleExpand = useMemoCallback((expandedKeys: Key[]) => {
    if (keyword) {
      setSearchExpandedKeys(expandedKeys);
    } else {
      setTreeExpandedKeys(expandedKeys);
    }
  });

  // 将所有节点映射称key value方便取值
  const keyNodeMap = useMemo(() => {
    return treeDataMap(treeData, {});
  }, [treeData]);

  // 计算搜索时需要展示的节点的key值
  const showTreeKey = useMemo(() => {
    if (!keyword) return [];
    return filterTreeData(treeData, keyword);
  }, [keyword, treeData]);

  // 加载部门数据
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
    if (keyword) {
      // 关键词一旦变化就重新展开所有节点
      setSearchExpandedKeys(Object.keys(keyNodeMap).map(Number));
    }
  }, [keyword, keyNodeMap]);

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

  const handleKeywordChange = useMemoCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      setKeyword(inputValue.trim());
    }, 300),
  );

  return (
    <div className={classnames(styles.selector, wrapperClass)}>
      <Input className={styles.search} onChange={handleKeywordChange} size="large" placeholder="搜索部门" />

      {treeData.length ? (
        <Tree
          className={classnames(styles.list, styles.tree, { [styles['in-search']]: !!keyword })}
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
            if (!keyword) return false;

            return showTreeKey.findIndex((key) => node.key === key) > -1;
          }}
        />
      ) : null}
      {treeData.length === 0 && <div>未搜索到部门</div>}
      {loading && <Loading className={styles.loading} />}
    </div>
  );
}

export default memo(DeptSelector);
