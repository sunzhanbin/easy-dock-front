import React, { memo, useState, useEffect, useMemo, useRef, useContext } from 'react';
import { throttle } from 'lodash';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import useMemoCallback from '../../../hooks/use-memo-callback';
import memberDefaultAvatar from '../avatars/member-default-avatar.png';
import Layout from './layout';
import { Image, Loading } from '../../../components';
import { ValueType } from '../type';
import SelectorContext from '../context';
import styles from '../index.module.scss';

interface MemberSelectorProps {
  fetchUser(data: {
    name: string;
    page: number;
  }): Promise<{ total: number; index: number; members: ValueType['members'] }>;
  value?: ValueType['members'];
  onChange?(value: NonNullable<this['value']>): void;
}

function MemberSelector(props: MemberSelectorProps) {
  const { value, onChange, fetchUser } = props;
  const { wrapperClass, projectId } = useContext(SelectorContext)!;
  const [members, setMembers] = useState<ValueType['members']>([]);
  const [loading, setLoading] = useState(false);
  const [memberTotal, setMemberTotal] = useState(0);
  const [memberSearchText, setMemberSearchText] = useState('');
  const memberPageNumberRef = useRef(1);
  const searchMembers = useMemoCallback(async (payload: { name: string; page: number }) => {
    if (loading) return;

    setLoading(true);

    try {
      const { members, total, index } = await fetchUser(payload);

      setMembers((oldValue) => {
        // 从第一页搜索时覆盖原数组
        if (payload.page === 1) {
          return members;
        } else {
          return oldValue.concat(members);
        }
      });
      // 更新当前页数
      memberPageNumberRef.current = index;
      setMemberTotal(total);
    } finally {
      setLoading(false);
    }
  });

  const handleKeywordChange = useMemoCallback((keyword: string) => {
    setMemberSearchText(keyword);
    memberPageNumberRef.current = 1;

    searchMembers({ page: 1, name: keyword });
  });

  const valueMaps = useMemo(() => {
    const maps: { [key: string]: boolean } = {};

    if (!value) {
      return maps;
    }

    value.forEach((member) => {
      maps[member.id] = true;
    });

    return maps;
  }, [value]);

  const handleChangeMembers = useMemoCallback((member: ValueType['members'][number], checked: boolean) => {
    let newMembers = value ? [...value] : [];

    if (checked) {
      newMembers.push(member);
    } else {
      newMembers = newMembers.filter((item) => item.id !== member.id);
    }

    if (onChange) {
      onChange(newMembers);
    }
  });

  useEffect(() => {
    searchMembers({ name: '', page: 1 });
  }, [searchMembers, projectId]);

  const handleMemberListScroll = useMemoCallback(
    throttle((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      // 全部加载完了就不加载了
      if (members.length === memberTotal) return;

      const container = event.target as HTMLDivElement;

      if (container.scrollHeight - container.offsetHeight - container.scrollTop < 20) {
        if (loading) return;

        searchMembers({
          page: memberPageNumberRef.current + 1,
          name: memberSearchText,
        });
      }
    }, 300),
  );
  return (
    <Layout className={wrapperClass} onKeywordChange={handleKeywordChange} keywordPlaceholder="搜索成员">
      <div className={classnames(styles.list, styles['member-selector'])} onScroll={handleMemberListScroll}>
        {!memberSearchText && <div className={styles.total}>全部成员({memberTotal})</div>}

        {members.map((member) => {
          const selected = valueMaps[member.id];

          return (
            <div key={member.id} className={styles.item} onClick={() => handleChangeMembers(member, !selected)}>
              <Image src={member.avatar} placeholder={memberDefaultAvatar} className={styles.avatar} size={24} round />
              <span className={styles.name}>{member.name}</span>
              <Checkbox checked={selected} />
            </div>
          );
        })}

        {members.length === 0 && <div>未搜索到用户</div>}

        {loading && <Loading className={styles.loading} />}
      </div>
    </Layout>
  );
}

export default memo(MemberSelector);
