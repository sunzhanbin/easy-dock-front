import { memo, useEffect } from "react";
import { Popover } from "antd";
import projectImage from "@assets/images/auth/project.png";
import { Icon, MemberList, Text, Loading } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import {
  useLazyFetchProjectPowersQuery,
  useFetchAllUserMutation,
  useRevokeAuthMutation,
  useAssignAuthMutation,
} from "@/http";
import MemberSelector from "@common/components/member-selector/selectors/member-selector";
import SelectorContext from "@common/components/member-selector/context";
import { AuthEnum, ResourceTypeEnum, OwnerTypeEnum, UserOwner } from "@utils/types";
import "@views/auth/project-auth.style.scss";
import { AssignAuthParams } from "@utils/types";
import { useAppSelector } from "@/store";
import { selectProjectAuthList } from "@views/home/index.slice";

const ProjectAuth = () => {
  const [fetchAllUser] = useFetchAllUserMutation();
  const [assignAuth] = useAssignAuthMutation();
  const [revokeAuth] = useRevokeAuthMutation();
  const projectList = useAppSelector(selectProjectAuthList);
  const [getProjectList, { isLoading }] = useLazyFetchProjectPowersQuery();

  useEffect(() => {
    getProjectList();
  }, [getProjectList]);

  // 回收项目管理员权限
  const deleteProjectManager = useMemoCallback((id, index) => {
    const powers = projectList[index].powers || [];
    const power = powers.find((power: { owner: { id: any } }) => id === power.owner.id);
    if (power && power.id) {
      (async () => {
        await revokeAuth({ id: power.id, ownerType: OwnerTypeEnum.USER, power: AuthEnum.ADMIN });
        getProjectList();
      })();
    }
  });

  const fetchUser = useMemoCallback(async (data: { name: string; page: number }) => {
    const memberResponse: any = await fetchAllUser({ index: data.page, size: 20, keyword: data.name });
    return {
      total: memberResponse.data.recordTotal,
      index: memberResponse.data.pageIndex,
      members: memberResponse.data.data.map(
        (item: { userName: string; id: number; avatar: string; loginName: string }) => {
          return {
            name: item.userName,
            id: item.id,
            avatar: item.avatar,
            loginName: item.loginName,
          };
        },
      ),
    };
  });
  const handleMembersChange = useMemoCallback(async (members, index) => {
    const project = projectList[index];
    const powers = project.powers || [];
    if (members.length > powers.length) {
      const member = members[members.length - 1];
      if (member && member.id) {
        const params: AssignAuthParams = {
          ownerKey: member.id + "",
          ownerType: OwnerTypeEnum.USER,
          power: AuthEnum.ADMIN,
          resourceKey: project.id + "",
          resourceType: ResourceTypeEnum.PROJECT,
        };
        await assignAuth(params);
        getProjectList();
      }
    } else {
      const powerList = [...powers];
      members.forEach((member: any) => {
        const index = powerList.findIndex((power) => (power.owner as unknown as UserOwner).id === member.id);
        powerList.splice(index, 1);
      });
      const power = powerList[0];
      if (power && power.id) {
        await revokeAuth({ id: power.id, ownerType: OwnerTypeEnum.USER, power: AuthEnum.ADMIN });
        getProjectList();
      }
    }
  });

  const renderContent = useMemoCallback((index) => {
    const project = projectList[index];
    const members = project.powers
      .filter((power: { owner: any; ownerType: any }) => power.owner && power.ownerType === OwnerTypeEnum.USER)
      .map((power: { owner: any }) => power.owner as UserOwner)
      .map((user: { userName: any }) => Object.assign({}, user, { name: user.userName, username: user.userName }));
    return (
      <div className="selector">
        <div className="add-manager">添加项目管理员</div>
        <SelectorContext.Provider value={{ wrapperClass: "member-selector" }}>
          <MemberSelector
            value={members}
            fetchUser={fetchUser}
            onChange={(value) => {
              handleMembersChange(value, index).then(() => {});
            }}
          />
        </SelectorContext.Provider>
      </div>
    );
  });
  return (
    <div className="container">
      {isLoading && <Loading className="loading" />}
      <div className="projectAuth">
        <div className="header">
          <img src={projectImage} alt="img" className="image" />
          <div className="title">
            <div className="name">项目管理员</div>
            <div className="text">为项目添加管理员，管理员可管理对应项目下的所有功能及数据权限</div>
          </div>
        </div>
        <div className="content">
          <div className="title">
            <div>项目</div>
            <div>管理员</div>
          </div>
          <div className="projectList">
            {projectList?.map((project: any, index: number) => {
              const members = project.powers
                .filter((power: { ownerType: any }) => power.ownerType === OwnerTypeEnum.USER)
                .map((power: { owner: any }) => power.owner as UserOwner)
                .map((user: any) => Object.assign({}, user, { name: user.userName }));
              return (
                <div className="project" key={project.id}>
                  <div className="name">
                    <Text text={project.name} placement="top" getContainer={false} />
                  </div>
                  <div className="administrator">
                    <div className="list">
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
                      <div className="add">
                        <Icon type="xinzeng" className="icon" />
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

export default memo(ProjectAuth);
