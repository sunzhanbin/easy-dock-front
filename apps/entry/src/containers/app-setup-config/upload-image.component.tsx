import { memo, FC, useState, useEffect } from "react";
import { message, Upload } from "antd";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import { axios } from "@utils/fetch";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { imgIdToUrl } from "@/utils/utils";
import { useAppDispatch } from "@/store";
import { setLogo } from "@/views/app-setup/basic-setup.slice";
import "./upload-image.style.scss";

interface UploadImageProps {
  value?: UploadFile[];
  onChange?: (value: this["value"]) => void;
}

const UploadImage: FC<UploadImageProps> = ({ value, onChange }) => {
  const dispatch = useAppDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // 校验图片类型和大小
  const checkoutFile = useMemoCallback((file: RcFile) => {
    const { type, size } = file;
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/bmp",
      "image/svg",
      "image/webp",
    ];
    const limitSize = 1024 * 1024 * 1; //1M
    if (!validTypes.includes(type)) {
      message.error(
        "当前仅支持上传.png .jpg .jpeg .gif .bmp .svg .webp格式的图片"
      );
      return false;
    }
    if (size > limitSize) {
      message.error("您所上传的图片超过1M，请调整后上传");
      return false;
    }
    return true;
  });
  const handleBeforeUpload = useMemoCallback((file: RcFile) => {
    if (!checkoutFile(file)) {
      return false;
    }
    return true;
  });
  const handleRemove = useMemoCallback((file: UploadFile) => {
    setFileList([]);
    dispatch(setLogo({}));
    onChange && onChange(undefined);
  });
  const handleCustomRequest = useMemoCallback(
    ({ file, onError, onSuccess }) => {
      const formData = new FormData();
      formData.append("files", file);
      axios
        .post(`/file/batchUpload?controlType=1`, formData)
        .then(({ data: response }: any) => {
          onSuccess(response, file);
          if (Array.isArray(response) && response.length > 0) {
            dispatch(setLogo(response[0]));
          }
          onChange && onChange(response);
        })
        .catch(onError);
    }
  );

  const downloadFile = useMemoCallback(async (image) => {
    if (!image.id) {
      return;
    }
    const url = await imgIdToUrl(image.id);
    const fileList = [
      {
        name: image.name,
        uid: image.id,
        url: url,
        thumbUrl: url,
      },
    ];
    setFileList(fileList);
  });

  useEffect(() => {
    if (value && value.length > 0) {
      const imageFile = value[0];
      downloadFile(imageFile);
    }
  }, [value]);

  return (
    <div className="upload-image-container">
      <Upload
        accept=".png,.jpg,.jpeg,.gif,.bmp,.svg,.webp"
        listType="picture-card"
        maxCount={1}
        fileList={fileList}
        showUploadList={{
          showPreviewIcon: false,
          showRemoveIcon: true,
          removeIcon: <Icon type="shanchu" style={{ color: "#fff" }} />,
        }}
        customRequest={handleCustomRequest}
        beforeUpload={handleBeforeUpload}
        onRemove={handleRemove}
      >
        {fileList && fileList.length >= 1 ? null : (
          <div className="upload-card">
            <Icon type="tupian" className="icon" />
            <div className="text">上传图片</div>
          </div>
        )}
      </Upload>
    </div>
  );
};

export default memo(UploadImage);
