import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Select } from "antd";
import { Icon } from "@common/components";
import { getPopupContainer } from "@utils/utils";
import "@components/select-card/index.style.scss";
import classnames from "classnames";
import useMemoCallback from "@common/hooks/use-memo-callback";
import DropdownMenuComponent from "@components/dropdown-menu/dropdown-menu-component";

const { Option } = Select;

export type SelectCardProps = {
  type: { key: string; label: string };
  list: { [key: string]: any }[] | [];
  onSelect?: (v: string | number) => void;
  onAdd?: (v: { name: string; isEdit: boolean; id?: number }) => any;
  onShowProjectModal?: () => any;
  onDelete?: (v: number) => any;
  selectedId?: string | number;
  isAdmin?: boolean;
  children?: ReactNode;
};

const SelectCard = (props: SelectCardProps) => {
  const { type, list, onSelect, onDelete, selectedId, isAdmin } = props;
  const menuRef = useRef<any>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // 判断是否显示下拉
  const [fieldList, setFieldList] = useState<any[]>([]); // 字段list

  useEffect(() => {
    if (!list) return;
    setFieldList(list as any);
  }, [list]);

  // option不支持编辑功能的选中
  const handleSelectField = (field: string | number) => {
    setShowDropdown(false);
    onSelect && onSelect(field);
  };

  // 获得焦点时
  const handleFocusSelect = () => {
    setShowDropdown(true);
  };

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
  const handleResetProjectName = useMemoCallback(() => {
    const list = fieldList.map((field) => ({
      ...field,
      editable: false,
    }));
    setFieldList(list);
  });

  // option支持编辑功能选中
  const handleSelectProject = (item: any) => {
    onSelect && onSelect(item.id);
    setShowDropdown(false);
  };

  const renderMenu = useMemoCallback((menu: React.ReactNode) => (
    <DropdownMenuComponent
      {...props}
      ref={menuRef}
      onEdit={editField}
      onDelete={onDelete}
      fieldList={fieldList}
      onReset={handleResetProjectName}
      onSelect={handleSelectProject}
      setShowDropdown={setShowDropdown}
      menu={menu}
    />
  ));

  // 下拉显隐控制
  const handleDropdownVisibleChange = useMemoCallback(async (status) => {
    if (status === false) {
      setShowDropdown(false);
      const list = fieldList.map((field) => ({
        ...field,
        editable: false,
      }));
      setFieldList(list);
      await menuRef.current.formReset();
      menuRef.current.setButtonStatus();
    } else {
      setShowDropdown(true);
    }
  });
  return (
    <div className="select-card">
      <Select
        open={showDropdown}
        onFocus={handleFocusSelect}
        className={classnames("select_field", `select_${type.key}`)}
        size="large"
        placeholder={`请选择${type.label}`}
        optionLabelProp="label"
        onDropdownVisibleChange={handleDropdownVisibleChange}
        onChange={handleSelectField}
        {...(type.key === "project" && { value: selectedId || undefined })}
        {...(type.key === "project" && {
          getPopupContainer: getPopupContainer,
        })}
        dropdownRender={renderMenu}
        suffixIcon={<Icon type="xiala" />}
      >
        {fieldList?.map((item: any) => (
          <Option key={item.id} value={item.id} label={item.name} className="option-name">
            {(type.key !== "project" || (type.key === "project" && !isAdmin)) && item.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectCard;
