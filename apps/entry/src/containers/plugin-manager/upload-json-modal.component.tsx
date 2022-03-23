import React, { memo, useState } from "react";
import { message, Modal } from "antd";
import UploadJsonComponent from "@containers/plugin-manager/upload-json.component";
import "@containers/plugin-manager/upload-json-component.style.scss";
import { PluginDataConfig } from "@common/type";
import { selectJsonMeta, setJSONMeta } from "@views/asset-centre/index.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { useLazyVerifyCodeUniqueQuery, useVerifyCodeConsistentMutation } from "@/http";
import { TableColumnsProps } from "@utils/types";

type ModalProps = {
  editItem?: TableColumnsProps | null;
  visible: boolean;
  onOK: () => void;
  onCancel: () => void;
};

const UploadJsonModalComponent = ({ editItem, visible, onCancel, onOK }: ModalProps) => {
  const dispatch = useAppDispatch();
  const jsonMeta = useAppSelector(selectJsonMeta);
  const [verifyCodeUnique] = useLazyVerifyCodeUniqueQuery();
  const [verifyCodeConsistent] = useVerifyCodeConsistentMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const handleCancel = useMemoCallback(() => {
    onCancel && onCancel();
    dispatch(setJSONMeta({}));
  });

  const handleOk = useMemoCallback(() => {
    if (!Object.keys(jsonMeta).length) {
      return message.error("请上传json文件！");
    }
    if (!jsonMeta?.code) {
      return message.error("插件编码不能为空，请修改后重新上传！");
    }
    if (!jsonMeta.meta || !jsonMeta.name) {
      return message.error("插件文件内容错误，请修改后重新上传！");
    }
    if (errorMessage) {
      return message.error(errorMessage);
    }
    onOK && onOK();
  });

  // 上传成功校验code是否唯一
  const handleSuccess = useMemoCallback(async (values: PluginDataConfig) => {
    try {
      dispatch(setJSONMeta(values));
      if (!values?.code) {
        return message.error("code不能为空，请修改后重新上传！");
      }
      if (editItem?.id) {
        const params = {
          id: editItem.id,
          code: values.code,
        };
        await verifyCodeConsistent(params).unwrap();
      } else {
        await verifyCodeUnique(values?.code).unwrap();
      }
      setErrorMessage("");
    } catch (e) {
      setErrorMessage(e.resultMessage);
    }
  });

  const handleRemove = useMemoCallback(() => {
    dispatch(setJSONMeta({}));
  });
  return (
    <Modal
      title={editItem ? "升级" : "新建插件"}
      visible={visible}
      centered={true}
      onCancel={handleCancel}
      onOk={handleOk}
      zIndex={10}
      destroyOnClose={true}
      okButtonProps={{ size: "large" }}
      cancelButtonProps={{ size: "large" }}
      okText={editItem ? "确认" : "下一步"}
      width={400}
      maskClosable={false}
    >
      <div className="upload-json-container">
        <UploadJsonComponent onSuccess={handleSuccess} onRemove={handleRemove} />
      </div>
    </Modal>
  );
};
export default memo(UploadJsonModalComponent);
