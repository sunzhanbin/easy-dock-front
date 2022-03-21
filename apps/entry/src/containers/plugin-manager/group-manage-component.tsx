import React, { memo } from "react";
import { message } from "antd";
import DropdownCard from "@components/dropdown-card";
import { useAddGroupsMutation, useDeleteGroupsMutation, useEditGroupsMutation } from "@/http";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { GroupListProps } from "@utils/types";

const DROPDOWN_CARD_TYPE = {
  key: "plugins",
  label: "分组",
};

const GroupManageComponent = ({ groupList }: GroupListProps) => {
  const [addGroups] = useAddGroupsMutation();
  const [editGroups] = useEditGroupsMutation();
  const [deleteGroups] = useDeleteGroupsMutation();

  const handleChangeGroups = useMemoCallback(async ({ name, isEdit, id }) => {
    if (!isEdit) {
      await addGroups({ name }).unwrap();
      message.success("创建成功");
    } else {
      await editGroups({ name, id }).unwrap();
      message.success("修改成功");
    }
  });

  const handleDeleteGroups = useMemoCallback(async (id: number) => {
    await deleteGroups(id).unwrap();
    message.success("删除成功");
  });
  return (
    <div className="group-manage-btn">
      <DropdownCard
        type={DROPDOWN_CARD_TYPE}
        list={groupList}
        onAdd={handleChangeGroups}
        onDelete={handleDeleteGroups}
      />
    </div>
  );
};

export default memo(GroupManageComponent);
