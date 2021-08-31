import { memo, FC, useMemo, useState, useEffect } from 'react';
import { Modal, Popover, Checkbox } from 'antd';
import { Icon, MemberList, Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import {
  SubAppTypeEnum,
  OwnerTypeEnum,
  SubAppPower,
  AppInfo,
  UserOwner,
  DepartOwner,
  RoleOwner,
  Power,
  AuthEnum,
} from '@/schema/app';
import { AppAuthParams, fetchSubAppPowers, Privilege } from '@/api/auth';
import Selector from '@common/components/member-selector/selector';
import styles from './index.module.scss';
import { ValueType } from '@common/components/member-selector/type';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type Visitor = {
  members: UserOwner[];
  departs: DepartOwner[];
  roles: RoleOwner[];
};
type SubAppVisitor = {
  id: string;
  visitor: Visitor;
  openVisit?: boolean;
};

const AuthModal: FC<{ appInfo: AppInfo; onClose: () => void; onOk: (value: AppAuthParams) => void }> = ({
  appInfo,
  onClose,
  onOk,
}) => {
  const { id: appId, name: appName, project } = appInfo;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataPowers, setDataPowers] = useState<Power[]>([]);
  const [subAppList, setSubAppList] = useState<SubAppPower[]>([]);
  const [dataVisitor, setDataVisitor] = useState<Visitor>({ members: [], departs: [], roles: [] });
  const [subAppVisitorList, setSubAppVisitorList] = useState<SubAppVisitor[]>([]);
  const fetchAppList = useMemoCallback(() => {
    setLoading(true);
    fetchSubAppPowers(String(appId))
      .then((res) => {
        const { data } = res;
        setDataPowers(data.dataPowers);
        setSubAppList(data.subappPowers);
      })
      .finally(() => {
        setLoading(false);
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
  const getVisitor = useMemoCallback(
    (powers: Power[]): Visitor => {
      const powerList = [...powers];
      const members = powerList
        .filter((power) => power.ownerType === OwnerTypeEnum.USER)
        .map((power) => Object.assign(power.owner, { name: (power.owner as UserOwner).userName }));
      const departs = powerList
        .filter((power) => power.ownerType === OwnerTypeEnum.DEPARTMENT)
        .map((power) => power.owner);
      const roles = powerList.filter((power) => power.ownerType === OwnerTypeEnum.ROLE).map((power) => power.owner);
      return { members, departs, roles };
    },
  );
  const deletePower = useMemoCallback(
    (visitor: Visitor, type, visitorId): Visitor => {
      const { members, departs, roles } = visitor;
      if (type === 'member') {
        const index = members.findIndex((member) => member.id === visitorId);
        members.splice(index, 1);
      } else if (type === 'dept') {
        const index = departs.findIndex((dept) => dept.id === visitorId);
        departs.splice(index, 1);
      } else if (type === 'role') {
        const index = roles.findIndex((role) => role.id === visitorId);
        roles.splice(index, 1);
      }
      return { members, departs, roles };
    },
  );
  const handleDeletePower = useMemoCallback((visitorId, type, id) => {
    if (id === 'flow') {
      setDataVisitor((visitor) => deletePower(visitor, type, visitorId));
    } else {
      setSubAppVisitorList((list) => {
        return list.map((item) => {
          if (item.id === id) {
            const visitor = deletePower(item.visitor, type, visitorId);
            return { id, visitor };
          }
          return item;
        });
      });
    }
  });

  const handleChange = useMemoCallback((value: ValueType, id) => {
    const members: UserOwner[] = value.members;
    const departs: DepartOwner[] = value.depts;
    const roles: RoleOwner[] = value.roles;
    if (id === 'flow') {
      setDataVisitor({ members, departs, roles });
    } else {
      setSubAppVisitorList((list) => {
        return list.map((item) => {
          if (item.id === id) {
            const visitor = { members, departs, roles };
            return { id, visitor };
          }
          return item;
        });
      });
    }
  });
  const renderContent = useMemoCallback(
    (id: string, members: UserOwner[], departs: DepartOwner[], roles: RoleOwner[]) => {
      return (
        <Selector
          className={styles.selector}
          value={{ members, depts: departs, roles: roles || [] }}
          projectId={+projectId}
          strictDept
          onChange={(value) => {
            handleChange(value, id);
          }}
        ></Selector>
      );
    },
  );
  const handleChangeOpenVisitor = useMemoCallback((e: CheckboxChangeEvent, id: string) => {
    const { checked } = e.target;
    setSubAppVisitorList((list) => {
      return list.map((item) => {
        if (item.id === id) {
          const { visitor } = item;
          return { id, visitor, openVisit: checked };
        }
        return item;
      });
    });
  });
  const renderAppItem = useMemoCallback((id: string, name: string) => {
    let visitor: Visitor = {
      members: [],
      departs: [],
      roles: [],
    };
    let openVisit = false;
    if (id === 'flow') {
      visitor = dataVisitor;
    } else {
      const subAppVisitorInfo = subAppVisitorList.find((item) => item.id === id);
      visitor = subAppVisitorInfo?.visitor || visitor;
      openVisit = subAppVisitorInfo?.openVisit || false;
    }
    const { members, departs, roles } = visitor;
    return (
      <div className={styles.app} key={id}>
        <div className={styles.title}>
          <div className={styles.name}>{name}</div>
          <div className={styles.change}>
            <Checkbox
              className={styles.all}
              checked={openVisit}
              style={{ opacity: id === 'flow' ? '0' : '1' }}
              onChange={(e) => {
                handleChangeOpenVisitor(e, id);
              }}
            >
              所有人
            </Checkbox>
            <Popover
              content={renderContent(id, members, departs, roles)}
              getPopupContainer={(c) => c}
              trigger="click"
              destroyTooltipOnHide
              placement="bottomRight"
              arrowContent={null}
            >
              <div className={styles.add} style={{ opacity: openVisit ? '0' : '1' }}>
                <Icon type="xinzeng" className={styles.icon} />
              </div>
            </Popover>
          </div>
        </div>
        {!openVisit && (
          <MemberList
            members={members}
            depts={departs}
            roles={roles}
            className={styles['member-list']}
            editable
            onDelete={(visitorId, type) => {
              handleDeletePower(visitorId, type, id);
            }}
          />
        )}
      </div>
    );
  });
  const visitorToPrivileges = useMemoCallback((visitor: Visitor, powerType: AuthEnum): Privilege[] => {
    const { members, departs, roles } = visitor;
    const privileges: Privilege[] = [];
    members.forEach((member) => {
      privileges.push({ ownerKey: member.id as string, ownerType: OwnerTypeEnum.USER, power: powerType });
    });
    departs.forEach((depart) => {
      privileges.push({ ownerKey: depart.id as string, ownerType: OwnerTypeEnum.DEPARTMENT, power: powerType });
    });
    roles.forEach((role) => {
      privileges.push({ ownerKey: role.id as string, ownerType: OwnerTypeEnum.ROLE, power: powerType });
    });
    return privileges;
  });
  const handleOk = useMemoCallback(() => {
    const dataPrivileges: Privilege[] = visitorToPrivileges(dataVisitor, AuthEnum.DATA);
    const subapps = subAppVisitorList.map((subAppVisitor) => {
      const { id, visitor, openVisit } = subAppVisitor;
      const privileges = visitorToPrivileges(visitor, AuthEnum.VISIT);
      return { id, privileges, openVisit };
    });
    const value: AppAuthParams = { id: String(appId), dataPrivileges, subapps };
    onOk(value);
  });

  useEffect(() => {
    fetchAppList();
  }, [fetchAppList]);
  useEffect(() => {
    if (dataPowers.length > 0) {
      const visitor = getVisitor(dataPowers);
      setDataVisitor(visitor);
    }
  }, [dataPowers, getVisitor]);
  useEffect(() => {
    if (subAppList.length > 0) {
      const subAppVisitorList = subAppList.map((subApp) => {
        const { id, powers, openVisit } = subApp;
        const visitor = getVisitor(powers);
        return { id: String(id), visitor, openVisit };
      });
      setSubAppVisitorList(subAppVisitorList);
    }
  }, [subAppList, getVisitor]);
  return (
    <Modal
      className={styles['auth-modal']}
      title={`${appName}应用端访问权限`}
      closeIcon={<Icon type="guanbi" className={styles.close} />}
      visible={true}
      centered={true}
      width={600}
      onCancel={onClose}
      onOk={handleOk}
    >
      {loading && <Loading />}
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
              {renderAppItem('flow', '流程数据管理')}
              {flowSubAppList.map((subApp) => {
                const { id, name } = subApp;
                return renderAppItem(String(id), name);
              })}
            </div>
          </div>
          {screenSubAppList.length > 0 && (
            <div className={styles['page-auth']}>
              <div className={styles.title}>页面</div>
              {screenSubAppList.map((subApp) => {
                const { id, name } = subApp;
                return renderAppItem(String(id), name);
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(AuthModal);
