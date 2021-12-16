import React, { useState, useEffect, useCallback } from "react";
import { Select, Button, Input, Form } from "antd";
import Icon from "@assets/icon";
import { getPopupContainer } from "@utils/utils";
import "@components/select-card/index.style.scss";
import classnames from "classnames";
import { nameRule } from "@/consts";

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
};
const SelectCard = ({
  type,
  list,
  onSelect,
  selectedId,
  onAdd,
  onDelete,
}: SelectCardProps) => {
  const [fieldName, setFieldName] = useState<string>("");
  const [editId, setEditId] = useState<number | undefined>(undefined);
  const [showButton, setShowButton] = useState<boolean>(true); // 判断是否显示新增按钮
  const [isEdit, setIsEdit] = useState<boolean>(false); // 判断是新增还是修改状态
  const [form] = Form.useForm<FormValuesType>();
  const [fieldList, setFieldList] = useState<any[]>([]);

  useEffect(() => {
    if (!list) return;
    setFieldList(list as any);
  }, [list]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  const handleSelectField = (field: string | number) => {
    onSelect && onSelect(field);
  };

  const addField = () => {
    setIsEdit(false);
    setShowButton(false);
  };
  const editField = useCallback(
    async (e: React.MouseEvent, item) => {
      e.stopPropagation();
      await setShowButton(false);
      setIsEdit(true);
      setEditId(item.id);
      form.setFieldsValue({ fieldName: item.name });
    },
    [form]
  );
  const deleteField = (e: React.MouseEvent, item: { id: number }) => {
    e.stopPropagation();
    onDelete && onDelete(item.id);
  };

  const handleConfirmName = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const parmas = {
        name: values.fieldName,
        isEdit,
        ...(editId ? { id: editId } : null),
      };
      await onAdd?.(parmas);
      form.setFieldsValue({ fieldName: "" });
      setEditId(undefined);
      setIsEdit(false);
      setShowButton(true);
    } catch (e) {
      console.log(e);
    }
  }, [fieldList, form, isEdit, editId]);

  const handleRevert = useCallback(async () => {
    await form.resetFields();
    await setEditId(undefined);
    await setIsEdit(false);
    setShowButton(true);
  }, [form]);

  // const handleDropdownVisible = () => {
  //   form.resetFields();
  //   setShowButton(true);
  // };
  return (
    <div className="select-card">
      <Select
        className={classnames("select_field", `select_${type.key}`)}
        size="large"
        placeholder={`请选择${type.label}`}
        optionLabelProp="label"
        onDropdownVisibleChange={handleRevert}
        onChange={handleSelectField}
        {...(type.key === "project" && { value: selectedId })}
        {...(type.key === "project" && {
          getPopupContainer: getPopupContainer,
        })}
        dropdownRender={(menu) => (
          <div className="dropdown-select-card">
            {menu}
            <Form form={form} name={type.key} className="footer_select">
              <Form.Item>
                {showButton ? (
                  <Form.Item noStyle>
                    <Button
                      className="btn_add_field"
                      size="large"
                      icon={<Icon type="custom-icon-xinzengjiacu" />}
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
                            type="custom-icon-gou"
                            onClick={handleConfirmName}
                          />

                          <Icon
                            className="close"
                            type="custom-icon-fanhuichexiao"
                            onClick={handleRevert}
                          />
                        </>
                      }
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Form>
          </div>
        )}
      >
        {fieldList?.map((item: any) => (
          <Option key={item.id} value={item.id} label={item.name}>
            <div className="field-option">
              <span className="option-name">{item.name}</span>
              {type.key === "project" && (
                <>
                  <Icon
                    className="edit-icon"
                    type="custom-icon-bianji"
                    onClick={(e) => editField(e, item)}
                  />
                  <Icon
                    className="delete-icon"
                    type="custom-icon-shanchu"
                    onClick={(e) => deleteField(e, item)}
                  />
                </>
              )}
            </div>
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectCard;
