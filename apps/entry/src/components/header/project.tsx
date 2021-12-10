import React, { useState, useCallback } from "react";
import { Select, Button, Input, Form } from "antd";
import Icon from "@assets/icon";
import { getPopupContainer } from "@utils/utils";
import "@components/header/project.style.scss";
import classnames from "classnames";

const { Option } = Select;

type FormValuesType = {
  projectName: string;
};
let index = 0;
const ProjectComponent = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [showButton, setShowButton] = useState<boolean>(true);
  const [form] = Form.useForm<FormValuesType>();
  const [projectList, setProjectList] = useState(["jack", "lucy"]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const addProject = () => {
    setShowButton(false);
  };

  const handleConfirmName = useCallback(async () => {
    if (!projectName) return;
    const values = await form.validateFields();
    if (!values.projectName) return false;
    setShowButton(true);
    // todo 掉接口
    setProjectList([...projectList, `111aaaaa${index++}`]);
    form.setFieldsValue({ projectName: "" });
  }, [projectList, projectName, form]);

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
        className="select_project"
        placeholder="请选择项目"
        getPopupContainer={getPopupContainer}
        onDropdownVisibleChange={handleDropdownVisible}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Form form={form} name="project" className="footer_select">
              <Form.Item>
                {showButton ? (
                  <Form.Item noStyle>
                    <Button
                      className="btn_add_project"
                      icon={<Icon type="custom-icon-xinzengjiacu" />}
                      onClick={addProject}
                    >
                      创建项目
                    </Button>
                  </Form.Item>
                ) : (
                  <Form.Item
                    noStyle
                    name="projectName"
                    rules={[
                      {
                        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,20}$/,
                        message: "项目名称应为3-20位汉字、字母、数字或下划线",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      onChange={handleNameChange}
                      suffix={
                        <>
                          <Icon
                            className={classnames(
                              "tick_icon",
                              !projectName ? "disabled" : ""
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
        {projectList.map((item: any) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default ProjectComponent;
