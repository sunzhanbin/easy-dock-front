import React, { memo, forwardRef, useImperativeHandle, ReactNode, useCallback, useState } from "react";
import { Button, Input, Form } from "antd";
import DropdownOptionComponents from "@components/dropdown-menu/dropdown-option-components";
import { nameRule } from "@/consts";
import classnames from "classnames";
import { Icon } from "@common/components";
import "@components/select-card/index.style.scss";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { CardOptionProps } from "@utils/types";

type DropdownMenuProps = CardOptionProps & {
  onReset?: () => void;
  onShowProjectModal?: () => any;
  menu?: ReactNode;
  onAdd?: (v: any) => void;
  isAdmin?: boolean;
  children?: ReactNode;
};

type FormValuesType = {
  fieldName: string;
};

const DropdownMenuComponent = forwardRef(function DropdownMenu(props: DropdownMenuProps, ref) {
  const {
    onEdit,
    fieldList,
    onReset,
    onSelect,
    setShowDropdown,
    onShowProjectModal,
    menu,
    type,
    onAdd,
    onDelete,
    isAdmin,
    children,
  } = props;
  const [fieldName, setFieldName] = useState<string>(""); // 新增字段名称
  const [showButton, setShowButton] = useState<boolean>(true); // 判断是否显示新增按钮
  const [form] = Form.useForm<FormValuesType>();

  useImperativeHandle(
    ref,
    () => ({
      formReset: () => {
        form.resetFields();
      },
      setButtonStatus: () => {
        setShowButton(true);
      },
    }),
    [form],
  );

  // 新增option
  const addField = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type.key === "project") {
      onShowProjectModal && onShowProjectModal();
    } else {
      setShowButton(false);
    }
  };

  // 新增字段名change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

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
  }, [form, onAdd]);

  // enter新增
  const handleEnter = useMemoCallback((e: any) => {
    if (e.target) {
      // 此处需阻止冒泡 避免和select选中事件冲突
      e.stopPropagation();
      setFieldName(e.target.value);
      handleAddName();
    }
  });

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

  // 新增字段名撤销
  const handleRevert = useCallback(async () => {
    await form.resetFields();
    setShowButton(true);
  }, [form]);

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
                        onClick={handleAddName}
                      />
                      <Icon className="close" type="fanhuichexiao" onClick={handleRevert} />
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
});

export default memo(DropdownMenuComponent);
