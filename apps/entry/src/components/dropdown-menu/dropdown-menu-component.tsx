import React, { memo, useState } from "react";
import { Button, Input, Form } from "antd";
import DropdownOptionComponents from "@components/dropdown-menu/dropdown-option-components";
import { nameRule } from "@/consts";
import classnames from "classnames";
import { Icon } from "@common/components";
import "@components/select-card/index.style.scss";

const DropdownMenuComponent = ({
  showButton,
  onEdit,
  fieldList,
  onReset,
  onSelect,
  addField,
  setShowDropdown,
  onAddName,
  onRevert,
  menu,
  type,
  onAdd,
  onDelete,
  isAdmin,
  children,
  form,
}: any) => {
  const [fieldName, setFieldName] = useState<string>(""); // 新增字段名称

  // 新增字段名change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  // option删除
  const deleteField = (item: { id: number }) => {
    onDelete && onDelete(item.id);
  };

  // option编辑字段名确认
  const handleEditProjectName = (values: any) => {
    const params = {
      name: values.fieldName,
      isEdit: true,
      id: values.id,
    };
    onAdd?.(params);
  };

  return (
    <div className="dropdown-select-card">
      {(type.key === "project" && isAdmin) || type.key === "plugins" ? (
        <DropdownOptionComponents
          type={type}
          onDelete={deleteField}
          onEdit={onEdit}
          fieldList={fieldList}
          onConfirm={handleEditProjectName}
          onRevert={onReset}
          onSelect={onSelect}
          setShowDropdown={setShowDropdown}
        />
      ) : (
        menu
      )}
      {((isAdmin && type.key === "project") || type.key !== "project") && (
        <Form form={form} name={type.key} className="footer_select">
          <Form.Item>
            {showButton ? (
              <Form.Item noStyle>
                <Button className="btn_add_field" size="large" icon={<Icon type="xinzengjiacu" />} onClick={addField}>
                  创建{type.label}
                </Button>
              </Form.Item>
            ) : (
              <Form.Item noStyle name="fieldName" rules={[nameRule]}>
                <Input
                  size="large"
                  onChange={handleNameChange}
                  placeholder={`请输入${type.label}名称`}
                  autoFocus
                  suffix={
                    <>
                      <Icon
                        className={classnames("tick_icon", !fieldName ? "disabled" : "")}
                        type="gou"
                        onClick={onAddName}
                      />
                      <Icon className="close" type="fanhuichexiao" onClick={onRevert} />
                    </>
                  }
                />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      )}
      {children}
    </div>
  );
};

export default memo(DropdownMenuComponent);
