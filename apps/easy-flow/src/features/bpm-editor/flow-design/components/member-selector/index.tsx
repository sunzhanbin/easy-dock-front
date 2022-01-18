import { memo, useMemo } from "react";
import { MemberSelector as Selector, MemberSelectorProps as SelectorProps } from "@common/components";
import { UserNode, CorrelationMemberConfigKey } from "@type/flow";
import { useSubAppDetail } from "@app/app";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import useShowMembers from "../../hooks/use-show-members";
import { flowDataSelector, setCacheMembers } from "../../flow-slice";

interface MemberSelectorProps {
  value?: UserNode["correlationMemberConfig"];
  onChange?(value: this["value"]): void;
}

function MemberSelector(props: MemberSelectorProps) {
  const { fieldsTemplate } = useAppSelector(flowDataSelector);
  const { value, onChange } = props;
  const { data: subAppDetail } = useSubAppDetail();
  const dispatch = useAppDispatch();
  const dynamicFields = useMemo(() => {
    return fieldsTemplate
      .filter((field) => field.type === "Member")
      .map((field) => ({ name: field.name, key: field.id }));
  }, [fieldsTemplate]);

  const showValue: NonNullable<SelectorProps["value"]> = useShowMembers(value!);

  const handleChange = (value: NonNullable<SelectorProps["value"]>) => {
    const caches: Parameters<typeof setCacheMembers>[number] = {};
    const { members = [], depts = [], roles = [], dynamic } = value;
    const memberIds: CorrelationMemberConfigKey[] = [];
    const deptIds: CorrelationMemberConfigKey[] = [];
    const roleIds: CorrelationMemberConfigKey[] = [];
    const dynamicRoles = (dynamic?.roles || []).map((role) => {
      caches[role.id] = role;

      return role.id;
    });

    members.forEach((user) => {
      caches[user.id] = user;
      memberIds.push(user.id);
    });

    depts.forEach((dept) => {
      caches[dept.id] = dept;
      deptIds.push(dept.id);
    });

    roles.forEach((role) => {
      caches[role.id] = role;
      roleIds.push(role.id);
    });

    dispatch(setCacheMembers(caches));

    if (onChange) {
      onChange({
        members: memberIds,
        depts: deptIds,
        roles: roleIds,
        dynamic: {
          starter: dynamic?.starter,
          roles: dynamicRoles,
          fields: (dynamic?.fields || []).map((field) => field.key),
        },
      });
    }
  };

  return (
    <Selector
      projectId={subAppDetail?.app.project.id}
      value={showValue}
      onChange={handleChange}
      strictDept
      showDynamic
      dynamicFields={dynamicFields}
    />
  );
}

export default memo(MemberSelector);
