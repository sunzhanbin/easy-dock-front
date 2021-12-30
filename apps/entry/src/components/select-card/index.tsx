import React, { useState, useEffect, useCallback } from "react";
import { Select, Button, Input, Form } from "antd";
import { Icon, Text } from "@common/components";
import { getPopupContainer } from "@utils/utils";
import "@components/select-card/index.style.scss";
import ProjectOption from "@components/select-card/project-option";
import classnames from "classnames";
import { nameRule } from "@/consts";
import useMemoCallback from "@common/hooks/use-memo-callback";

const { Option } = Select;

type FormValuesType = {
  fieldName: string;
};

type SelectCardProps = {
  type: { key: string; label: string };
  list: { [key: string]: any }[] | [];
  onSelect?: (v: string | number) => void;
  onAdd?: (v: { name: string; isEdit: boolean; id?: number }) => any;
  onDelete?: (v: number) => any;
  selectedId?: string | number;
  isAdmin?: boolean;
};
const SelectCard = ({
  type,
  list,
  onSelect,
  selectedId,
  onAdd,
  onDelete,
  isAdmin,
}: SelectCardProps) => {
  const [fieldName, setFieldName] = useState<string>(""); // 新增字段名称
  const [showButton, setShowButton] = useState<boolean>(true); // 判断是否显示新增按钮
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // 判断是否显示下拉
  const [form] = Form.useForm<FormValuesType>();
  const [fieldList, setFieldList] = useState<any[]>([]); // 字段list

  useEffect(() => {
    if (!list) return;
    setFieldList(list as any);
  }, [list]);

  // 新增字段名change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  // option不支持编辑功能的选中
  const handleSelectField = (field: string | number) => {
    setShowDropdown(false);
    onSelect && onSelect(field);
  };

  // 新增option
  const addField = () => {
    setShowButton(false);
  };

  // 获得焦点时
  const handleFocusSelect = () => {
    setShowDropdown(true);
  };

  // option支持点击编辑
  const editField = useMemoCallback(
    (e: React.MouseEvent, item: { id: number }) => {
      e.stopPropagation();
      const list = [...fieldList].map((field) => ({
        ...field,
        editable: field.id === item.id,
      }));
      setFieldList(list);
    }
  );
  // option删除
  const deleteField = (item: { id: number }) => {
    onDelete && onDelete(item.id);
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
  }, [form]);

  // option编辑字段名确认
  const handleEditProjectName = (values: any) => {
    const params = {
      name: values.fieldName,
      isEdit: true,
      id: values.id,
    };
    onAdd?.(params);
  };
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

  const renderMenu = (menu: React.ReactNode) => (
    <div className="dropdown-select-card">
      {type.key === "project" && isAdmin ? (
        <ProjectOption
          onDelete={deleteField}
          onEdit={editField}
          fieldList={fieldList}
          onConfirm={handleEditProjectName}
          onRevert={handleResetProjectName}
          onSelect={handleSelectProject}
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
                <Button
                  className="btn_add_field"
                  size="large"
                  icon={<Icon type="xinzengjiacu" />}
                  onClick={addField}
                >
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
                        className={classnames(
                          "tick_icon",
                          !fieldName ? "disabled" : ""
                        )}
                        type="gou"
                        onClick={handleAddName}
                      />
                      <Icon
                        className="close"
                        type="fanhuichexiao"
                        onClick={handleRevert}
                      />
                    </>
                  }
                />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      )}
    </div>
  );

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
          <Option key={item.id} value={item.id} label={item.name}>
            {(type.key !== "project" ||
              (type.key === "project" && !isAdmin)) && (
              <Text text={item.name} className="option-name" />
            )}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectCard;
