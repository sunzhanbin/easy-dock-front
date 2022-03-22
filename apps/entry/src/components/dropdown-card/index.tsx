import React, { useRef, useEffect, useState } from "react";
import { Button, Dropdown } from "antd";
import { Icon } from "@common/components";
import DropdownMenuComponent from "@components/dropdown-menu/dropdown-menu-component";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { getPopupContainer } from "@utils/utils";
import "@components/dropdown-card/index.style.scss";

export type DropdownCardProps = {
  type: { key: string; label: string };
  list: { [key: string]: any }[] | [];
  onAdd?: (v: { name: string; isEdit: boolean; id?: number }) => any;
  onDelete?: (v: number) => any;
};

const DropDownCard = (props: DropdownCardProps) => {
  const { list } = props;
  const [fieldList, setFieldList] = useState<any[]>([]); // 字段list
  const menuRef = useRef<any>(null);

  useEffect(() => {
    if (!list) return;
    setFieldList(list as any);
  }, [list]);

  // option支持点击编辑
  const editField = useMemoCallback((e: React.MouseEvent, item: { id: number }) => {
    e.stopPropagation();
    const list = [...fieldList].map((field) => ({
      ...field,
      editable: field.id === item.id,
    }));
    setFieldList(list);
    menuRef.current.setButtonStatus();
  });

  // option编辑字段名撤销
  const handleEditResetName = useMemoCallback(() => {
    const list = fieldList.map((field) => ({
      ...field,
      editable: false,
    }));
    setFieldList(list);
  });

  // 下拉显隐控制
  const handleDropdownVisibleChange = useMemoCallback(async (status) => {
    if (status === false) {
      const list = fieldList.map((field) => ({
        ...field,
        editable: false,
      }));
      setFieldList(list);
      await menuRef.current.formReset();
      menuRef.current.setButtonStatus();
    }
  });

  const menu = useMemoCallback(() => {
    return (
      <DropdownMenuComponent
        {...props}
        ref={menuRef}
        fieldList={fieldList}
        onEdit={editField}
        onReset={handleEditResetName}
      />
    );
  });
  return (
    <Dropdown
      className="dropdown-card"
      overlay={menu}
      onVisibleChange={handleDropdownVisibleChange}
      placement="bottomLeft"
      getPopupContainer={getPopupContainer}
    >
      <Button size="large" icon={<Icon type="yihangduolie" />} className="button">
        分组管理
      </Button>
    </Dropdown>
  );
};

export default DropDownCard;
