import { memo, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { Icon } from '@common/components';
import { runtimeAxios } from '@/utils';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { debounce, throttle } from 'lodash';

const { Option } = Select;
// 为了保证不报错，暂时先用人员组件代替
const Department = (
  props: SelectProps<string> & {
    readOnly: boolean;
    multiple: boolean;
    projectid: number;
  },
) => {
  const { defaultValue, multiple, value, showSearch, projectid, onChange } = props;
  const [memberList, setMemberList] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [memberTotal, setMemberTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>('');
  const memberPageNumberRef = useRef(1);

  const handleSearch = useMemoCallback(
    debounce((val) => {
      setKeyword(val);
      memberPageNumberRef.current = 1;
      fetchMembers(1, val);
    }, 500),
  );
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | Function | ReactNode } = {
      size: 'large',
      showSearch: showSearch as boolean,
      placeholder: '请选择',
      suffixIcon: <Icon type="xiala" />,
      onChange: onChange as Function,
    };
    if (multiple) {
      prop.mode = 'multiple';
    }
    if (value) {
      if (Array.isArray(value)) {
        prop.value = value.map((v) => Number(v));
      } else {
        prop.value = Number(value);
      }
    }
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        prop.value = defaultValue.map((v) => Number(v));
      } else {
        prop.defaultValue = Number(defaultValue);
      }
    }
    if (showSearch) {
      prop.onSearch = handleSearch;
    }
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    return result;
  }, [defaultValue, value, multiple, showSearch, props, handleSearch, onChange]);

  const fetchMembers = useMemoCallback(async (pageNum: number, keyword: string) => {
    if (projectid && !loading) {
      setLoading(true);
      try {
        const res = await runtimeAxios.post('/user/search', {
          index: pageNum,
          size: 20,
          projectId: projectid,
          keyword,
        });
        const list = res.data?.data || [];
        const total = res.data?.recordTotal;
        const index = res.data?.pageIndex;
        setMemberList((val) => {
          // 从第一页搜索时覆盖原数组
          if (pageNum === 1) {
            return list;
          }
          return val.concat(list);
        });
        // 更新当前页数
        memberPageNumberRef.current = index;
        setMemberTotal(total);
        return list;
      } finally {
        setLoading(false);
      }
    }
  });

  const handleScroll = useMemoCallback(
    throttle((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      // 全部加载完了就不加载了
      if (memberList.length === memberTotal) return;

      const container = event.target as HTMLDivElement;

      if (container.scrollHeight - container.offsetHeight - container.scrollTop < 20) {
        if (loading) return;

        fetchMembers(memberPageNumberRef.current + 1, keyword);
      }
    }, 300),
  );

  useEffect(() => {
    fetchMembers(1, '');
  }, [fetchMembers]);

  return (
    <Select {...propList} style={{ width: '100%' }} optionFilterProp="label" onPopupScroll={handleScroll} allowClear>
      {(memberList || []).map(({ id, userName }) => (
        <Option key={id} value={id} label={userName}>
          {userName}
        </Option>
      ))}
    </Select>
  );
};

export default memo(Department);
