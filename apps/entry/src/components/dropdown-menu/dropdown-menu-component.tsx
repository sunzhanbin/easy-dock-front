import React, { memo, ReactNode, useState } from "react";
import { Button, Input, Form } from "antd";
import DropdownOptionComponents from "@components/dropdown-menu/dropdown-option-components";
import { nameRule } from "@/consts";
import classnames from "classnames";
import { Icon } from "@common/components";
import "@components/select-card/index.style.scss";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { CardOptionProps } from "@utils/types";
import { FormInstance } from "antd/es";

type DropdownMenuProps = CardOptionProps & {
  showButton: boolean;
  onReset?: () => void;
  addField?: (e: React.MouseEvent) => void;
  onAddName?: () => void;
  menu?: ReactNode;
  onAdd?: (v: any) => void;
  isAdmin?: boolean;
  children?: ReactNode;
  form: FormInstance;
};

const DropdownMenuComponent = (props: DropdownMenuProps) => {
  const {
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
  } = props;
  const [fieldName, setFieldName] = useState<string>(""); // 新增字段名称

  // 新增字段名change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  // enter新增
  const handleEnter: React.KeyboardEventHandler<HTMLInputElement> = (e: any) => {
    if (e.target) {
      setFieldName(e.target.value);
      onAddName && onAddName();
    }
  };

  // option删除
  const deleteField = useMemoCallback((item: { id: number }) => {
    onDelete && onDelete(item.id);
  });

  // option编辑字段名确认
  const handleEditProjectName = useMemoCallback((values: any) => {
    const params = {
      name: values.fieldName,
      isEdit: true,
      id: values.id,
    };
    onAdd?.(params);
  });

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
                  onPressEnter={handleEnter}
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
