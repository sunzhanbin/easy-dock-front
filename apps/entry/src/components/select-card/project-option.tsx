import React, { memo, useCallback, useState } from "react";
import { Form, Input, message } from "antd";
import { PopoverConfirm, Icon } from "@common/components";

import classnames from "classnames";
import { nameRule } from "@/consts";

type OptionProps = {
  fieldList: any[];
  onDelete: (item: any) => void;
  onEdit: (e: React.MouseEvent, item: any) => void;
  onConfirm: (v: any) => void;
  onSelect: (v: any) => void;
  onRevert: () => void;
  setShowDropdown: (v: boolean) => void;
};

type FormValuesType = {
  fieldName: string;
};
const ProjectOption = ({
  fieldList,
  onDelete,
  onEdit,
  onConfirm,
  onRevert,
  onSelect,
  setShowDropdown,
}: OptionProps) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [form] = Form.useForm<FormValuesType>();

  // option支持编辑
  const handleEdit = useCallback((e, item) => {
    form.setFieldsValue({ fieldName: item.name });
    onEdit(e, item);
  }, []);
  // option确认编辑
  const handleConfirm = useCallback(
    async (item) => {
      try {
        const values = await form.validateFields();
        onConfirm({ ...values, id: item.id });
      } catch (e) {
        message.error("请输入3-20位的汉字、字母、数字、下划线");
        console.log(e);
      }
    },
    [form]
  );
  // option选中
  const handleSelectField = (item: any, index: number) => {
    onSelect(item);
    setActiveIndex(index);
  };

  // 删除option
  const handlePopOver = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(true);
  };

  return (
    <div className="dropdown-select-project">
      {fieldList.map((item, index) => (
        <div
          key={index}
          className={classnames(
            "field-option",
            activeIndex === index ? "active" : ""
          )}
        >
          {item.editable ? (
            <Form
              form={form}
              name="editProject"
              style={{ width: "100%" }}
              initialValues={{ fieldName: item.name }}
            >
              <Form.Item name="fieldName" rules={[nameRule]} noStyle>
                <Input
                  autoFocus
                  placeholder="请输入项目名称"
                  className="input-name"
                  suffix={
                    <>
                      <Icon
                        className={classnames("tick_icon")}
                        type="gou"
                        onClick={() => handleConfirm(item)}
                      />

                      <Icon
                        className="close"
                        type="fanhuichexiao"
                        onClick={onRevert}
                      />
                    </>
                  }
                />
              </Form.Item>
            </Form>
          ) : (
            <React.Fragment key={item.id}>
              <span
                className="option-name"
                onClick={() => handleSelectField(item, index)}
              >
                {item.name}
              </span>
              <Icon
                className="edit-icon"
                type="bianji"
                onClick={(e) => handleEdit(e, item)}
              />
              <PopoverConfirm
                title="提示"
                placement="bottom"
                content="删除后不可恢复,请确认是否删除该项目?"
                getPopupContainer={() => document.getElementById("root")!}
                onConfirm={() => onDelete(item)}
              >
                <Icon
                  className="delete-icon"
                  type="shanchu"
                  onClick={(e) => handlePopOver(e)}
                />
              </PopoverConfirm>
            </React.Fragment>
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(ProjectOption);
