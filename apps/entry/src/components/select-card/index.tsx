import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { Select, Form } from "antd";
import { Icon, Text } from "@common/components";
import { getPopupContainer } from "@utils/utils";
import "@components/select-card/index.style.scss";
import classnames from "classnames";
import useMemoCallback from "@common/hooks/use-memo-callback";
import DropdownMenuComponent from "@components/dropdown-menu/dropdown-menu-component";

const { Option } = Select;

type FormValuesType = {
  fieldName: string;
};

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
  const { type, list, onSelect, onDelete, selectedId, onAdd, isAdmin, onShowProjectModal } = props;
  const [showButton, setShowButton] = useState<boolean>(true); // 判断是否显示新增工作区按钮
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // 判断是否显示下拉
  const [form] = Form.useForm<FormValuesType>();
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

  // 新增option
  const addField = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type.key === "project") {
      onShowProjectModal && onShowProjectModal();
    } else {
      setShowButton(false);
    }
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
  });

  // option新增字段名确认
  const handleAddName = useCallback(async () => {
    try {
      const values = await form.validateFields();
      console.log(values, "--------");
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
  const handleResetProjectName = useMemoCallback(() => {
    const list = fieldList.map((field) => ({
      ...field,
      editable: false,
    }));
    setFieldList(list);
  });

  // 新增字段名撤销
  const handleRevert = useCallback(async () => {
    await form.resetFields();
    setShowButton(true);
  }, [form]);

  // option支持编辑功能选中
  const handleSelectProject = (item: any) => {
    onSelect && onSelect(item.id);
    setShowDropdown(false);
  };

  const renderMenu = useMemoCallback((menu: React.ReactNode) => (
    <DropdownMenuComponent
      {...props}
      form={form}
      showButton={showButton}
      onEdit={editField}
      onDelete={onDelete}
      fieldList={fieldList}
      onReset={handleResetProjectName}
      onSelect={handleSelectProject}
      setShowDropdown={setShowDropdown}
      onAddName={handleAddName}
      addField={addField}
      onRevert={handleRevert}
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
      await form.resetFields();
      setShowButton(true);
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
