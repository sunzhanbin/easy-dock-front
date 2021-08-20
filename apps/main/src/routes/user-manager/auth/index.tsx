import { memo, useState, useEffect } from 'react';
import { Popover } from 'antd';
import projectImage from '@assets/project.png';
import { Icon, MemberList, Text, Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { fetchProjectPowers, revokeAuth, assignAuth, AssignAuthParams } from '@/api/auth';
import MemberSelector from '@components/member-selector';
import { AuthEnum, ResourceTypeEnum, OwnerTypeEnum, ProjectPower } from '@/schema/app';
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
      revokeAuth({ id: power.id, ownerType: OwnerTypeEnum.USER, power: AuthEnum.ADMIN }).then(() => {
        getProjectList();
      });
    }
  });
  useEffect(() => {
    setLoading(true);
    getProjectList();
  }, []);

  const handleMembersChange = useMemoCallback((member, index, projectId, checked) => {
    // 如果是选中复选框就分配管理员权限,否则就回收管理员权限
    if (checked) {
      if (member && member.id) {
        const params: AssignAuthParams = {
          ownerKey: member.id,
          ownerType: OwnerTypeEnum.USER,
          power: AuthEnum.ADMIN,
          resourceKey: projectId,
          resourceType: ResourceTypeEnum.PROJECT,
        };
        assignAuth(params).then(() => {
          getProjectList();
        });
      }
    } else {
      const powers = projectList[index].powers || [];
      const power = powers.find((power) => member.id === power.owner.id);
      if (power && power.id) {
        revokeAuth({ id: power.id, ownerType: 1, power: 1 }).then(() => {
          getProjectList();
        });
      }
    }
  });

  const renderContent = useMemoCallback((index) => {
    const project = projectList[index];
    const members = project.powers
      .map((power) => power.owner)
      .map((user) => Object.assign({}, user, { username: (user as any).userName }));
    return (
      <MemberSelector
        title="添加项目管理员"
        projectId={project.id}
        value={{ members }}
        onMembersChange={(member, checked) => {
          handleMembersChange(member, index, project.id, checked);
        }}
      />
    );
  });
  return (
    <div className={styles.container}>
      {loading && <Loading className={styles.loading} />}
      <div className={styles.projectAuth}>
        <div className={styles.header}>
          <img src={projectImage} alt="image" className={styles.image} />
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
                .map((power) => power.owner)
                .map((user) => Object.assign({}, user, { username: (user as any).userName }));
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
