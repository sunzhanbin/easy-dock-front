import React, { memo, useState, useEffect, useMemo, useRef } from 'react';
import { Tabs, Input, Checkbox } from 'antd';
import { throttle } from 'lodash';
import { ValueType } from './type';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Loading } from '@common/components';
import memberDefaultAvatar from '@assets/members/member-default-avatar.png';
import { Image } from '@common/components';
import { runtimeAxios } from '@utils';
import styles from './index.module.scss';

const { TabPane } = Tabs;

const fetchUser = async (data: { name: string; page: number }) => {
  const memberResponse = await runtimeAxios.post('/user/search', {
    index: data.page,
    size: 20,
    keyword: data.name,
  });

  return {
    total: memberResponse.data.recordTotal,
    index: memberResponse.data.pageIndex,
    members: memberResponse.data.data.map((item: { userName: string; loginName: string; avatar: string }) => {
      return {
        name: item.userName,
        loginName: item.loginName,
        avatar: item.avatar,
      };
    }),
  };
};

interface SelectorProps {
  value: ValueType;
  onMembersChange?(value: ValueType['members']): void;
}

function Selector(props: SelectorProps) {
  const { value, onMembersChange } = props;
  const [members, setMembers] = useState<ValueType['members']>([]);
  const [loading, setLoading] = useState(false);
  const [memberTotal, setMemberTotal] = useState(0);
  const [memberSearchText, setMemberSearchText] = useState('');
  const memberPageNumberRef = useRef(1);
  const timerRef = useRef<NodeJS.Timeout>();
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

  const handleMemberSearchTextChange: React.ChangeEventHandler<HTMLInputElement> = useMemoCallback(async (event) => {
    const name = (event.target.value || '').trim();

    setMemberSearchText(name);
    memberPageNumberRef.current = 1;

    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      searchMembers({ page: 1, name });
    }, 300);
  });

  const valueMaps = useMemo(() => {
    const maps: { [key: string]: boolean } = {};

    if (!value) {
      return maps;
    }

    value.members.forEach((member) => {
      maps[member.loginName] = true;
    });

    return maps;
  }, [value]);

  const handleChangeMembers = useMemoCallback((member: ValueType['members'][number], checked: boolean) => {
    let newMembers = value ? [...value.members] : [];

    if (checked) {
      newMembers.push(member);
    } else {
      newMembers = newMembers.filter((item) => item.loginName !== member.loginName);
    }

    if (onMembersChange) {
      onMembersChange(newMembers);
    }
  });

  useEffect(() => {
    searchMembers({ name: '', page: 1 });
  }, [searchMembers]);

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
    <div className={styles.content}>
      <Tabs defaultActiveKey="member">
        <TabPane tab="成员" key="member">
          <Input
            placeholder="搜索成员"
            className={styles.search}
            onChange={handleMemberSearchTextChange}
            size="large"
            value={memberSearchText}
          />
          <div className={styles.list} onScroll={handleMemberListScroll}>
            {!memberSearchText && <div className={styles.total}>全部成员({memberTotal})</div>}

            {members.map((member) => {
              const selected = valueMaps[member.loginName];

              return (
                <div
                  key={member.loginName}
                  className={styles.item}
                  onClick={() => handleChangeMembers(member, !selected)}
                >
                  <Image
                    src={member.avatar}
                    placeholder={memberDefaultAvatar}
                    className={styles.avatar}
                    size={24}
                    round
                  />
                  <span className={styles.name}>{member.name}</span>
                  <Checkbox checked={selected} />
                </div>
              );
            })}

            {members.length === 0 && <div>未搜索到用户</div>}
          </div>
        </TabPane>
        <TabPane tab="角色" key="role">
          功能暂未开放
        </TabPane>
      </Tabs>

      {loading && <Loading className={styles.loading} />}
    </div>
  );
}

export default memo(Selector);
