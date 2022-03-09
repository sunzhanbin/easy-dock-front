import React, { memo, useState } from "react";
import { message, Upload } from "antd";
import { UploadFile, RcFile } from "antd/lib/upload/interface";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import FileImage from "@assets/images/assets/file.png";
import UploadImage from "@assets/images/assets/upload.png";
import { PluginMeta } from "@common/type";

interface UploadJSONProps {
  file: RcFile;
  fileList: UploadFile[];
}

type UploadJsonProps = {
  onSuccess: (v: PluginMeta) => void;
};

const UploadJsonComponent = ({ onSuccess }: UploadJsonProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleRemove = useMemoCallback(() => {
    setFileList([]);
  });
  const handleUploadFile = ({ file, fileList }: UploadJSONProps) => {
    if (file) {
      if (file.type !== "application/json") {
        message.error("文件类型错误,请上传json文件!");
        return;
      }
      const fileListWithUrl = fileList.map((item) => ({
        ...item,
        thumbUrl: FileImage,
      }));
      setFileList(fileListWithUrl);
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const content = e.target?.result;
        try {
          const result = typeof content === "string" && JSON.parse(content);
          if (result) {
            onSuccess &&
              onSuccess({
                ...result,
                name: file.name,
              });
          }
        } catch (error) {
          console.error(error);
        }
      };
    }
  };
  return (
    <Upload
      accept=".json"
      showUploadList={{
        showPreviewIcon: false,
        showRemoveIcon: true,
        removeIcon: <Icon type="shanchu" />,
      }}
      listType="picture-card"
      maxCount={1}
      fileList={fileList}
      beforeUpload={() => false}
      onChange={handleUploadFile}
      onRemove={handleRemove}
    >
      {!fileList.length && (
        <div className="text-wrapper">
          <img className="upload-image" src={UploadImage} alt="" width={48} height={48} />
          <p>上传json文件</p>
        </div>
      )}
    </Upload>
  );
};
export default memo(UploadJsonComponent);
