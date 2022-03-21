import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Dropdown, Form } from "antd";
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
  selectedId?: string | number;
  isAdmin?: boolean;
  children?: ReactNode;
};

type FormValuesType = {
  fieldName: string;
};

const DropDownCard = (props: DropdownCardProps) => {
  const { list, onAdd } = props;
  const [showButton, setShowButton] = useState<boolean>(true); // 判断是否显示新增按钮
  const [form] = Form.useForm<FormValuesType>();
  const [fieldList, setFieldList] = useState<any[]>([]); // 字段list

  useEffect(() => {
    if (!list) return;
    setFieldList(list as any);
  }, [list]);

  // 新增option
  const addField = (e: React.MouseEvent) => {
    e.stopPropagation();
    const list = fieldList.map((field) => ({
      ...field,
      editable: false,
    }));
    setFieldList(list);
    setShowButton(false);
  };

  // option支持点击编辑
  const editField = useMemoCallback((e: React.MouseEvent, item: { id: number }) => {
    e.stopPropagation();
    const list = [...fieldList].map((field) => ({
      ...field,
      editable: field.id === item.id,
    }));
    setFieldList(list);
    setShowButton(true);
  });

  // option新增字段名确认
  const handleAddName = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const params = {
        name: values.fieldName,
        isEdit: false,
      };
      await onAdd?.(params);
      form.setFieldsValue({ fieldName: "" });
      setShowButton(true);
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // option编辑字段名撤销
  const handleEditResetName = useMemoCallback(() => {
    const list = fieldList.map((field) => ({
      ...field,
      editable: false,
    }));
    setFieldList(list);
  });

  // 新增字段名撤销
  const handleNewRevertName = useCallback(async () => {
    await form.resetFields();
    setShowButton(true);
  }, [form]);

  // 下拉显隐控制
  const handleDropdownVisibleChange = useMemoCallback(async (status) => {
    if (status === false) {
      // setShowDropdown(false);
      const list = fieldList.map((field) => ({
        ...field,
        editable: false,
      }));
      setFieldList(list);
      await form.resetFields();
      setShowButton(true);
    } else {
      // setShowDropdown(true);
    }
  });

  const menu = useMemoCallback(() => {
    return (
      <DropdownMenuComponent
        {...props}
        form={form}
        fieldList={fieldList}
        showButton={showButton}
        onEdit={editField}
        onReset={handleEditResetName}
        onAddName={handleAddName}
        addField={addField}
        onRevert={handleNewRevertName}
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
