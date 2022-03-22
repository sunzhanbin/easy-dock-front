import { memo, useEffect } from "react";
import { Form, Modal, Select } from "antd";
import { Icon } from "@common/components";
import { useAppSelector } from "@/store";
import { AssignAuthType } from "@utils/const";
import { selectProjectList } from "@views/home/index.slice";
import { selectBindingTenantList } from "@views/asset-centre/index.slice";

type TenantModalProps = {
  visible: boolean;
  type?: number;
  onOK: (v: any) => void;
  onCancel: () => void;
};

const { Option } = Select;

const AuthTenantModalComponent = ({ type, visible, onOK, onCancel }: TenantModalProps) => {
  const projectList = useAppSelector(selectProjectList);
  const bindingTenantList = useAppSelector(selectBindingTenantList);
  const [form] = Form.useForm();

  useEffect(() => {
    const projectIds = bindingTenantList?.map((item) => String(item.id));
    form.setFieldsValue({ projectIds });
  }, [bindingTenantList, form]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const handleOk = () => {
    const { projectIds } = form.getFieldsValue();
    if (!projectIds.length) return;
    onOK && onOK(projectIds);
  };

  return (
    <Modal
      title={`${type === AssignAuthType.BATCH ? "批量授权" : "指定项目"}`}
      visible={visible}
      centered={true}
      onCancel={handleCancel}
      onOk={handleOk}
      width={400}
      getContainer={false}
      destroyOnClose={true}
      maskClosable={false}
      okButtonProps={{ size: "large" }}
      cancelButtonProps={{ size: "large" }}
    >
      <Form form={form} className="form" layout="vertical" autoComplete="off" preserve={false}>
        <Form.Item label="选择项目" name="projectIds">
          <Select
            mode="tags"
            tokenSeparators={[","]}
            placeholder="请选择项目"
            size="large"
            allowClear
            suffixIcon={<Icon type="xiala" />}
          >
            {projectList?.map((item: any) => (
              <Option key={item.id} value={String(item.id)}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(AuthTenantModalComponent);
