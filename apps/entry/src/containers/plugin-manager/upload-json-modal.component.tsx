import React, { memo, useState } from "react";
import { Modal } from "antd";
import UploadJsonComponent from "@containers/plugin-manager/upload-json.component";
import "@containers/plugin-manager/upload-json-component.style.scss";
import { PluginDataConfig } from "@common/type";
import { setJSONMeta } from "@views/asset-centre/index.slice";
import { useAppDispatch } from "@/store";
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
  const [verifyCodeUnique] = useLazyVerifyCodeUniqueQuery();
  const [verifyCodeConsistent] = useVerifyCodeConsistentMutation();
  const [checkCode, setCheckCode] = useState(false);

  const handleCancel = useMemoCallback(() => {
    onCancel && onCancel();
    dispatch(setJSONMeta({}));
    setCheckCode(false);
  });

  const handleOk = useMemoCallback(() => {
    checkCode && onOK && onOK();
  });

  // 上传成功校验code是否唯一
  const handleSuccess = useMemoCallback(async (values: PluginDataConfig) => {
    try {
      console.log(values, "=============");
      if (!values?.code) return;
      if (editItem?.id) {
        const params = {
          id: editItem.id,
          code: values.code,
        };
        const result = await verifyCodeConsistent(params).unwrap();
        setCheckCode(result);
      } else {
        const result = await verifyCodeUnique(values?.code).unwrap();
        setCheckCode(result);
      }
      dispatch(setJSONMeta(values));
    } catch (e) {
      console.log(e);
      setCheckCode(false);
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
