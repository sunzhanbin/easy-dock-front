import { memo, useState, useEffect } from 'react';
import { Popover } from 'antd';
import projectImage from '@assets/project.png';
import { Icon, MemberList, Text, Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { fetchProjectPowers, revokeAuth, assignAuth, AssignAuthParams, fetchAllUser } from '@/api/auth';
import MemberSelector from '@common/components/member-selector/selectors/member-selector';
import SelectorContext from '@common/components/member-selector/context';
import { AuthEnum, ResourceTypeEnum, OwnerTypeEnum, ProjectPower, UserOwner } from '@/schema/app';
import styles from './index.module.scss';

const Auth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<ProjectPower[]>([]);
  const getProjectList = useMemoCallback(() => {
    fetchProjectPowers()
      .then((res) => {
        setProjectList(res.data || []);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      });
  });
  // 回收项目管理员权限
  const deleteProjectManager = useMemoCallback((id, index) => {
    const powers = projectList[index].powers || [];
    const power = powers.find((power) => id === power.owner.id);
    if (power && power.id) {
      setLoading(true);
      revokeAuth({ id: power.id, ownerType: OwnerTypeEnum.USER, power: AuthEnum.ADMIN }).then(() => {
        getProjectList();
      });
    }
  });
  useEffect(() => {
    setLoading(true);
    getProjectList();
  }, [getProjectList]);

  const fetchUser = useMemoCallback(async (data: { name: string; page: number }) => {
    const memberResponse = await fetchAllUser({ index: data.page, size: 20, keyword: data.name });

    return {
      total: memberResponse.data.recordTotal,
      index: memberResponse.data.pageIndex,
      members: memberResponse.data.data.map((item: { userName: string; id: number; avatar: string }) => {
        return {
          name: item.userName,
          id: item.id,
          avatar: item.avatar,
        };
      }),
    };
  });
  const handleMembersChange = useMemoCallback((members, index) => {
    const project = projectList[index];
    const powers = project.powers || [];
    if (members.length > powers.length) {
      const member = members[members.length - 1];
      if (member && member.id) {
        const params: AssignAuthParams = {
          ownerKey: member.id + '',
          ownerType: OwnerTypeEnum.USER,
          power: AuthEnum.ADMIN,
          resourceKey: project.id + '',
          resourceType: ResourceTypeEnum.PROJECT,
        };
        assignAuth(params).then(() => {
          getProjectList();
        });
      }
    } else {
      const powerList = [...powers];
      members.forEach((member: User) => {
        const index = powerList.findIndex((power) => ((power.owner as unknown) as UserOwner).id === member.id);
        powerList.splice(index, 1);
      });
      const power = powerList[0];
      if (power && power.id) {
        revokeAuth({ id: power.id, ownerType: OwnerTypeEnum.USER, power: AuthEnum.ADMIN }).then(() => {
          getProjectList();
        });
      }
    }
  });

  const renderContent = useMemoCallback((index) => {
    const project = projectList[index];
    const members = project.powers
      .filter((power) => power.owner && power.ownerType === OwnerTypeEnum.USER)
      .map((power) => power.owner as UserOwner)
      .map((user) => Object.assign({}, user, { name: user.userName, username: user.userName }));
    return (
      <div className={styles.selector}>
        <div className={styles['add-manager']}>添加项目管理员</div>
        <SelectorContext.Provider value={{ wrapperClass: styles['member-selector'] }}>
          <MemberSelector
            value={members}
            fetchUser={fetchUser}
            onChange={(value) => {
              handleMembersChange(value, index);
            }}
          />
        </SelectorContext.Provider>
      </div>
    );
  });
  return (
    <div className={styles.container}>
      {loading && <Loading className={styles.loading} />}
      <div className={styles.projectAuth}>
        <div className={styles.header}>
          <img src={projectImage} alt="img" className={styles.image} />
          <div className={styles.title}>
            <div className={styles.name}>项目管理员</div>
            <div className={styles.text}>为项目添加管理员，管理员可管理对应项目下的所有功能及数据权限</div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>项目</div>
            <div>管理员</div>
          </div>
          <div className={styles.projectList}>
            {projectList.map((project, index) => {
              const members = project.powers
                .filter((power) => power.ownerType === OwnerTypeEnum.USER)
                .map((power) => power.owner as UserOwner)
                .map((user) => Object.assign({}, user, { name: user.userName }));
              return (
                <div className={styles.project} key={project.id}>
                  <div className={styles.name}>
                    <Text text={project.name} placement="top" getContainer={false} />
                  </div>
                  <div className={styles.administrator}>
                    <div className={styles.list}>
                      <MemberList
                        members={members}
                        editable={true}
                        onDelete={(id) => {
                          deleteProjectManager(id, index);
                        }}
                      />
                    </div>
                    <Popover
                      content={renderContent(index)}
                      getPopupContainer={(c) => c}
                      trigger="click"
                      destroyTooltipOnHide
                      placement="bottomRight"
                      arrowContent={null}
                    >
                      <div className={styles.add}>
                        <Icon type="xinzeng" className={styles.icon} />
                      </div>
                    </Popover>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Auth);
