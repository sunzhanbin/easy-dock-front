import React, { useState, useCallback } from "react";
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
  list?: { [key: string]: string }[];
  onSelect?: (v: string) => void;
};
const SelectCard = ({ type, list, onSelect }: SelectCardProps) => {
  const [fieldName, setFieldName] = useState<string>("");
  const [showButton, setShowButton] = useState<boolean>(true);
  const [form] = Form.useForm<FormValuesType>();
  const [fieldList, setFieldList] = useState(list || []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  const handleSelectField = (field: string) => {
    onSelect && onSelect(field);
  };

  const addField = () => {
    setShowButton(false);
  };

  const handleConfirmName = useCallback(async () => {
    if (!fieldName) return;
    const values = await form.validateFields();
    if (!values.fieldName) return false;
    setShowButton(true);
    // todo 掉接口 fieldName 和fieldId加入
    setFieldList([...fieldList]);
    form.setFieldsValue({ fieldName: "" });
  }, [fieldList, fieldName, form]);

  const handleRevert = () => {
    form.resetFields();
    setShowButton(true);
  };

  const handleDropdownVisible = () => {
    form.resetFields();
    setShowButton(true);
  };
  return (
    <>
      <Select
        className={classnames("select_field", `select_${type.key}`)}
        size="large"
        placeholder={`请选择${type.label}`}
        onDropdownVisibleChange={handleDropdownVisible}
        onChange={handleSelectField}
        {...(type.key === "project" && {
          getPopupContainer: getPopupContainer,
        })}
        dropdownRender={(menu) => (
          <>
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
          </>
        )}
      >
        {list?.map((item: any) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default SelectCard;
