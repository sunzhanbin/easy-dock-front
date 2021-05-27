import React, { memo, useState, useEffect, useMemo, useRef } from 'react';
import { Tabs, Input, Checkbox } from 'antd';
import { debounce, throttle } from 'lodash';
import { ValueType } from './type';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Loading } from '@common/components';
import memberDefaultAvatar from '@assets/members/member-default-avatar.png';
import { axios } from '@utils';
import styles from './index.module.scss';

const { TabPane } = Tabs;

const fetchUser = async (data: { name: string; page: number }) => {
  const memberResponse = await axios.post(
    '/api/auth/v1/user/list',
    {
      condition: data.name,
      pageNum: data.page,
      pageSize: 20,
      queryField: 'cnName',
    },
    {
      headers: { auth: '9649555a10ff4177927c0acd422bad5d' },
      baseURL: 'http://10.19.151.141:28201',
    },
  );

  return {
    total: memberResponse.data.recordTotal,
    index: memberResponse.data.pageIndex,
    members: memberResponse.data.data.map((item: any) => {
      const member = item.userInfo[0];

      return {
        name: member.cnName,
        loginName: item.loginName,
        avatar: member.staffPhoto,
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
  const [loading, setLoading] = useState(true);
  const [memberTotal, setMemberTotal] = useState(0);
  const [memberSearchText, setMemberSearchText] = useState('');
  const memberPageNumberRef = useRef(1);
  const searchMembers = useMemoCallback(
    async (payload: { name: string; page: number }, cover: boolean = false) => {
      setLoading(true);

      try {
        const { members, total, index } = await fetchUser(payload);

        if (cover) {
          setMembers(members);
        } else {
          setMembers((oldValue) => oldValue.concat(members));
        }

        // 更新当前页数
        memberPageNumberRef.current = index;
        setMemberTotal(total);
      } finally {
        setLoading(false);
      }
    },
  );

  const debounceSearchUser = debounce(searchMembers, 300);

  const handleMemberSearchTextChange: React.ChangeEventHandler<HTMLInputElement> = useMemoCallback(
    async (event) => {
      const name = (event.target.value || '').trim();

      setMemberSearchText(name);
      memberPageNumberRef.current = 1;

      debounceSearchUser({ page: 1, name }, true);
    },
  );

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

  const handleChangeMembers = useMemoCallback(
    (member: ValueType['members'][number], checked: boolean) => {
      let newMembers = value ? [...value.members] : [];

      if (checked) {
        newMembers.push(member);
      } else {
        newMembers = newMembers.filter((item) => item.loginName !== member.loginName);
      }

      if (onMembersChange) {
        onMembersChange(newMembers);
      }
    },
  );

  useEffect(() => {
    searchMembers({ name: '', page: 1 });
  }, []);

  const handleMemberListScroll = useMemoCallback(
    throttle((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const container = event.target as HTMLDivElement;

      if (container.scrollHeight - container.offsetHeight - container.scrollTop < 20) {
        if (loading || members.length === memberTotal) {
          return;
        }

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
                  <img
                    className={styles.avatar}
                    src={member.avatar || memberDefaultAvatar}
                    alt="用户头像"
                  />
                  <span className={styles.name}>{member.name}</span>
                  <Checkbox checked={selected} />
                </div>
              );
            })}

            {members.length === 0 && <div>未搜索到用户</div>}
          </div>
        </TabPane>
        <TabPane tab="部门" key="dept">
          功能暂未开放
        </TabPane>
      </Tabs>

      {loading && <Loading className={styles.loading} />}
    </div>
  );
}

export default memo(Selector);
