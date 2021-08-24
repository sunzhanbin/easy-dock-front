import { memo, FC, useMemo, useState, useEffect } from 'react';
import { Modal, Popover } from 'antd';
import { Icon, MemberList } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import {
  SubAppTypeEnum,
  OwnerTypeEnum,
  SubAppPower,
  AppInfo,
  UserOwner,
  DepartOwner,
  RoleOwner,
  AuthEnum,
  ResourceTypeEnum,
  Power,
} from '@/schema/app';
import { fetchSubAppPowers } from '@/api/auth';
import Selector from '@common/components/member-selector/selector';
import styles from './index.module.scss';
import { Dept, Role } from '@common/type';
import { revokeAuth, assignAuth, AssignAuthParams } from '@/api/auth';
import { ValueType } from '@common/components/member-selector/type';

const ownerTypeMap: { [k in string]: number } = {
  member: OwnerTypeEnum.USER,
  dept: OwnerTypeEnum.DEPARTMENT,
  role: OwnerTypeEnum.ROLE,
};
type AddAuthParams = {
  oldValue: UserOwner[] | DepartOwner[] | RoleOwner[];
  newValue: User[] | Dept[] | Role[];
  ownerType: OwnerTypeEnum;
  powerType: AuthEnum;
  resourceKey: string | number;
  resourceType: ResourceTypeEnum;
};
type RemoveAuthParams = {
  oldValue: Power[];
  newValue: User[] | Dept[] | Role[];
  ownerType: OwnerTypeEnum;
  powerType: AuthEnum;
};

const AuthModal: FC<{ appInfo: AppInfo; onClose: () => void; onOk: () => void }> = ({ appInfo, onClose, onOk }) => {
  const { id: appId, name: appName, project } = appInfo;
  const [dataPowers, setDataPowers] = useState<Power[]>([]);
  const [subAppList, setSubAppList] = useState<SubAppPower[]>([]);
  const fetchAppList = useMemoCallback(() => {
    fetchSubAppPowers(appId + '').then((res) => {
      setDataPowers(res.data.dataPowers);
      setSubAppList(res.data.subappPowers);
    });
  });
  const projectId = useMemo(() => {
    return project.id || '';
  }, [project]);
  const flowSubAppList = useMemo(() => {
    return subAppList.filter((subApp) => subApp.type === SubAppTypeEnum.FLOW) || [];
  }, [subAppList]);
  const screenSubAppList = useMemo(() => {
    return subAppList.filter((subApp) => subApp.type === SubAppTypeEnum.SCREEN) || [];
  }, [subAppList]);
  const handleDeletePower = useMemoCallback((id, type, index) => {
    const powerList = index === -1 ? dataPowers : subAppList[index].powers;
    const power = powerList.find((power) => power.owner?.id === id);
    const powerType = index === -1 ? AuthEnum.DATA : AuthEnum.VISIT;
    if (power && power.id) {
      revokeAuth({ id: power.id, ownerType: ownerTypeMap[type], power: powerType }).then(() => {
        fetchAppList();
      });
    }
  });

  const addAuth = useMemoCallback((data: AddAuthParams) => {
    const { oldValue, newValue, ownerType, powerType, resourceKey, resourceType } = data;
    const ownerList = [...newValue];
    oldValue.forEach((val) => {
      const index = ownerList.findIndex((owner) => owner.id === val.id);
      index !== -1 && ownerList.splice(index, 1);
    });
    const owner = ownerList[0];
    if (owner && owner.id) {
      const params: AssignAuthParams = {
        ownerKey: owner.id + '',
        ownerType,
        power: powerType,
        resourceKey: resourceKey + '',
        resourceType,
      };
      assignAuth(params).then(() => {
        fetchAppList();
      });
    }
  });
  const removeAuth = useMemoCallback((data: RemoveAuthParams) => {
    const { oldValue, newValue, ownerType, powerType } = data;
    const powerList = [...oldValue];
    newValue.forEach((val) => {
      const index = powerList.findIndex((power) => power.owner.id === val.id);
      index !== -1 && powerList.splice(index, 1);
    });
    const power = powerList[0];
    if (power && power.id) {
      revokeAuth({ id: power.id, ownerType, power: powerType }).then(() => {
        fetchAppList();
      });
    }
  });

  const handleChange = useMemoCallback(
    (oldValue: { members: UserOwner[]; departs: DepartOwner[]; roles: RoleOwner[] }, newValue: ValueType, index) => {
      const { members: memberList = [], departs: departList = [], roles: roleList = [] } = oldValue;
      const { members, depts: departs, roles } = newValue;
      const subApp = index > -1 && subAppList[index];
      const subAppId = (subApp && subApp.id) || '';
      const powers = (subApp && subApp.powers) || [];
      const powerType = index === -1 ? AuthEnum.DATA : AuthEnum.VISIT;
      const resourceKey = index === -1 ? appId : subAppId;
      const resourceType = index === -1 ? ResourceTypeEnum.APP : ResourceTypeEnum.SUB_APP;
      // 增加人员权限
      if (members.length > memberList.length) {
        addAuth({
          oldValue: memberList,
          newValue: members,
          ownerType: OwnerTypeEnum.USER,
          powerType,
          resourceKey,
          resourceType,
        });
        return;
      }
      // 移除人员权限
      if (members.length < memberList.length) {
        const list = index === -1 ? [...dataPowers] : [...powers];
        const powerList = list.filter((power) => power.ownerType === OwnerTypeEnum.USER);
        removeAuth({ oldValue: powerList, newValue: members, ownerType: OwnerTypeEnum.USER, powerType });
        return;
      }
      // 增加部门权限
      if (departs.length > departList.length) {
        addAuth({
          oldValue: departList,
          newValue: departs,
          ownerType: OwnerTypeEnum.DEPARTMENT,
          powerType,
          resourceKey,
          resourceType,
        });
        return;
      }
      // 移除部门权限
      if (departs.length < departList.length) {
        const list = index === -1 ? [...dataPowers] : [...powers];
        const powerList = list.filter((power) => power.ownerType === OwnerTypeEnum.DEPARTMENT);
        removeAuth({ oldValue: powerList, newValue: departs, ownerType: OwnerTypeEnum.DEPARTMENT, powerType });
        return;
      }
      // 增加角色权限
      if (roles.length > roleList.length) {
        addAuth({
          oldValue: roleList,
          newValue: roles,
          ownerType: OwnerTypeEnum.ROLE,
          powerType,
          resourceKey,
          resourceType,
        });
        return;
      }
      // 移除角色权限
      if (roles.length < roleList.length) {
        const list = index === -1 ? [...dataPowers] : [...powers];
        const powerList = list.filter((power) => power.ownerType === OwnerTypeEnum.ROLE);
        removeAuth({ oldValue: powerList, newValue: roles, ownerType: OwnerTypeEnum.ROLE, powerType });
        return;
      }
    },
  );
  const renderContent = useMemoCallback(
    (index: number, members: UserOwner[], departs: DepartOwner[], roles: RoleOwner[]) => {
      return (
        <Selector
          className={styles.selector}
          value={{ members, depts: departs, roles: roles || [] }}
          projectId={+projectId}
          strictDept={true}
          onChange={(value) => {
            handleChange({ members, departs, roles }, value, index);
          }}
        ></Selector>
      );
    },
  );
  const renderAppItem = useMemoCallback((powers: Power[], key: string, index: number, name: string) => {
    const powerList = [...powers];
    const members = powerList
      .filter((power) => power.ownerType === OwnerTypeEnum.USER)
      .map((power) => Object.assign(power.owner, { name: (power.owner as any).userName }) as UserOwner);
    const departs = powerList
      .filter((power) => power.ownerType === OwnerTypeEnum.DEPARTMENT)
      .map((power) => power.owner as DepartOwner);
    const roles = powerList
      .filter((power) => power.ownerType === OwnerTypeEnum.ROLE)
      .map((power) => power.owner as RoleOwner);
    return (
      <div className={styles.app} key={key}>
        <div className={styles.title}>
          <div className={styles.name}>{name}</div>
          <Popover
            content={renderContent(index, members, departs, roles)}
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
        <MemberList
          members={members as any}
          depts={(departs as unknown) as Dept[]}
          roles={roles}
          className={styles['member-list']}
          editable
          onDelete={(id, type) => {
            handleDeletePower(id, type, index);
          }}
        />
      </div>
    );
  });

  useEffect(() => {
    fetchAppList();
  }, []);
  return (
    <Modal
      className={styles['auth-modal']}
      title={`${appName}应用端访问权限`}
      closeIcon={<Icon type="guanbi" className={styles.close} />}
      visible={true}
      centered={true}
      width={600}
      onCancel={onClose}
      onOk={onOk}
    >
      <div className={styles.content}>
        <div className={styles.tip}>
          <div className={styles.icon}>
            <Icon type="shuomingwukuang" />
          </div>
          <div className={styles.text}>子应用设置成员或角色后，成员或角色会在应用端看到该菜单</div>
        </div>
        <div className={styles['auth-list']}>
          <div className={styles['flow-auth']}>
            <div className={styles.title}>流程</div>
            <div className={styles['app-list']}>
              {renderAppItem(dataPowers, 'flow', -1, '流程数据管理')}
              {flowSubAppList.map((subApp, index) => {
                const { id, name, powers } = subApp;
                return renderAppItem(powers, id + '', index, name);
              })}
            </div>
          </div>
          {screenSubAppList.length > 0 && (
            <div className={styles['page-auth']}>
              <div className={styles.title}>页面</div>
              {screenSubAppList.map((subApp, index) => {
                const { id, name, powers } = subApp;
                return renderAppItem(powers, id + '', index, name);
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(AuthModal);
