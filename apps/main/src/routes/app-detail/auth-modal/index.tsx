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
  AuthEnum,
  ResourceTypeEnum,
  Power,
} from '@/schema/app';
import { fetchSubAppPowers } from '@/api/auth';
import Selector from '@common/components/member-selector/selector';
import styles from './index.module.scss';
import { Depart } from '@common/type';
import { revokeAuth, assignAuth, AssignAuthParams } from '@/api/auth';
import { ValueType } from '@common/components/member-selector/type';

const ownerTypeMap: { [k in string]: number } = {
  member: OwnerTypeEnum.USER,
  depart: OwnerTypeEnum.DEPARTMENT,
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

  const handleChange = useMemoCallback((value: ValueType, index, memberList = [], departList = []) => {
    const { members, departs } = value;
    const subApp = index > -1 && subAppList[index];
    const subAppId = (subApp && subApp.id) || '';
    const powers = (subApp && subApp.powers) || [];
    const powerType = index === -1 ? AuthEnum.DATA : AuthEnum.VISIT;
    const resourceKey = index === -1 ? appId : subAppId;
    const resourceType = index === -1 ? ResourceTypeEnum.APP : ResourceTypeEnum.SUB_APP;
    // 增加人员权限
    if (members.length > memberList.length) {
      const member = members[members.length - 1];
      if (member && member.id) {
        const params: AssignAuthParams = {
          ownerKey: member.id + '',
          ownerType: OwnerTypeEnum.USER,
          power: powerType,
          resourceKey: resourceKey + '',
          resourceType,
        };
        assignAuth(params).then(() => {
          fetchAppList();
        });
      }
      return;
    }
    // 移除人员权限
    if (members.length < memberList.length) {
      const powerList = [...powers].filter((power) => power.ownerType === OwnerTypeEnum.USER);
      members.forEach((member) => {
        const index = powerList.findIndex((power) => ((power.owner as unknown) as UserOwner).id === member.id);
        powerList.splice(index, 1);
      });
      const power = powerList[0];
      if (power && power.id) {
        revokeAuth({ id: power.id, ownerType: OwnerTypeEnum.USER, power: powerType }).then(() => {
          fetchAppList();
        });
      }
      return;
    }
    // 增加部门权限
    if (departs.length > departList.length) {
      const depart: Depart = departs[departs.length - 1];
      if (depart && depart.id) {
        const params: AssignAuthParams = {
          ownerKey: depart.id + '',
          ownerType: OwnerTypeEnum.DEPARTMENT,
          power: powerType,
          resourceKey: resourceKey + '',
          resourceType,
        };
        assignAuth(params).then(() => {
          fetchAppList();
        });
        return;
      }
    }
    // 移除部门权限
    if (departs.length < departList.length) {
      const powerList = [...powers].filter((power) => power.ownerType === OwnerTypeEnum.DEPARTMENT);
      departs.forEach((depart) => {
        const index = powerList.findIndex((power) => ((power.owner as unknown) as DepartOwner).id === depart.id);
        powerList.splice(index, 1);
      });
      const power = powerList[0];
      if (power && power.id) {
        revokeAuth({ id: power.id, ownerType: OwnerTypeEnum.DEPARTMENT, power: powerType }).then(() => {
          fetchAppList();
        });
      }
    }
  });
  const renderContent = useMemoCallback((index: number, members: UserOwner[], departs: DepartOwner[]) => {
    return (
      <Selector
        className={styles.selector}
        value={{ members, departs }}
        projectId={+projectId}
        onChange={(value) => {
          handleChange(value, index, members, departs);
        }}
      ></Selector>
    );
  });
  const renderDataManage = useMemoCallback(() => {
    const members = dataPowers
      .filter((power) => power.ownerType === OwnerTypeEnum.USER)
      .map((power) => power.owner)
      .map((owner) => (Object.assign({}, owner, { name: (owner as any).userName }) as unknown) as UserOwner);
    const departs = dataPowers
      .filter((power) => power.ownerType === OwnerTypeEnum.DEPARTMENT)
      .map((power) => power.owner as DepartOwner);
    return (
      <>
        <div className={styles.title}>
          <div className={styles.name}>流程数据管理</div>
          <Popover
            content={renderContent(-1, members, departs)}
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
          departs={(departs as unknown) as Depart[]}
          className={styles['member-list']}
          editable
          onDelete={(id, type) => {
            handleDeletePower(id, type, -1);
          }}
        />
      </>
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
              <div className={styles.app}>{renderDataManage()}</div>
              {flowSubAppList.map((subApp, index) => {
                const { powers } = subApp;
                const members = powers
                  .filter((power) => power.ownerType === OwnerTypeEnum.USER)
                  .map((power) => power.owner)
                  .map(
                    (owner) => (Object.assign({}, owner, { name: (owner as any).userName }) as unknown) as UserOwner,
                  );
                const departs = powers
                  .filter((power) => power.ownerType === OwnerTypeEnum.DEPARTMENT)
                  .map((power) => (power.owner as unknown) as DepartOwner);
                return (
                  <div className={styles.app} key={subApp.id}>
                    <div className={styles.title}>
                      <div className={styles.name}>{subApp.name}</div>
                      <Popover
                        content={renderContent(index, members, departs)}
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
                      departs={(departs as unknown) as Depart[]}
                      className={styles['member-list']}
                      editable
                      onDelete={(id, type) => {
                        handleDeletePower(id, type, index);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {screenSubAppList.length > 0 && (
            <div className={styles['page-auth']}>
              <div className={styles.title}>页面</div>
              {screenSubAppList.map((subApp, index) => {
                const { powers } = subApp;
                const members = powers
                  .filter((power) => power.ownerType === OwnerTypeEnum.USER)
                  .map((power) => power.owner)
                  .map(
                    (owner) => (Object.assign({}, owner, { name: (owner as any).userName }) as unknown) as UserOwner,
                  );
                const departs = powers
                  .filter((power) => power.ownerType === OwnerTypeEnum.DEPARTMENT)
                  .map((power) => (power.owner as unknown) as DepartOwner);
                return (
                  <div className={styles.app} key={subApp.id}>
                    <div className={styles.title}>
                      <div className={styles.name}>{subApp.name}</div>
                      <Popover
                        content={renderContent(index, members, departs)}
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
                      departs={(departs as unknown) as Depart[]}
                      className={styles['member-list']}
                      editable
                      onDelete={(id, type) => {
                        handleDeletePower(id, type, index);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(AuthModal);
