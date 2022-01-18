import { memo, useEffect, useState, useRef } from "react";
import { Upload, Modal, message } from "antd";
import { UploadChangeParam, UploadFile, UploadProps } from "antd/lib/upload/interface";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Icon } from "@common/components";
import { getBase64 } from "@/utils";
import { downloadFile } from "@/apis/file";
import styles from "./index.module.scss";

export type ImageValue = {
  type: "Image";
  fileIdList?: { id: string; name: string }[];
  fileList?: UploadFile[];
};

const ImageComponent = (
  props: UploadProps & {
    colSpace?: string;
    value?: ImageValue | string;
    onChange?: (value: ImageValue | string) => void;
  },
) => {
  const { maxCount = 10, colSpace = "4", value, disabled, onChange } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [addFileCount, setAddFileCount] = useState<number>(0);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  // 校验图片类型和大小
  const checkoutFile = useMemoCallback((file: File) => {
    const { type, size } = file;
    const isJPG = type === "image/jpeg";
    const isPNG = type === "image/png";
    const limitSize = 1024 * 1024 * 5; //5M
    if (!isJPG && !isPNG) {
      message.error("当前仅支持上传.png .jpg .jpeg格式图片");
      return false;
    }
    if (size > limitSize) {
      message.error("您所上传的图片超过5M，请调整后上传");
      return false;
    }
    return true;
  });

  const handleChange = useMemoCallback(({ file: image }: UploadChangeParam) => {
    const list = [...fileList];
    // 移除图片
    if (image.status === "removed") {
      const index = list.findIndex((item) => item.uid === image.uid);
      list.splice(index, 1);
      const newValue = Object.assign({}, value, { fileList: list, type: "Image" });
      setFileList(list);
      onChange && onChange(newValue);
      setAddFileCount((n) => n - 1);
      return;
    }
    // 上传图片
    const validatedFile = checkoutFile(image as unknown as File);
    if (validatedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(image as any);
      reader.onload = function () {
        const url = reader.result;
        const file = Object.assign({}, image, { originFileObj: image, percent: 99, thumbUrl: url });
        list.push(file);
        const newValue = Object.assign({}, value, { fileList: list, type: "Image" });
        setFileList(list);
        setAddFileCount((n) => n + 1);
        onChange && onChange(newValue);
      };
    }
  });
  // 预览
  const onPreview = useMemoCallback(async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.originFileObj.name);
  });
  // 阻止图片自动上传
  const handleBeforeUpload = useMemoCallback(() => {
    return false;
  });
  const handleCancel = useMemoCallback(() => {
    setPreviewVisible(false);
  });
  const handleRemove = useMemoCallback((file) => {
    if (value) {
      const componentValue = typeof value === "string" ? (JSON.parse(value) as ImageValue) : { ...value };
      const { fileIdList = [] } = componentValue;
      const list = [...fileIdList];
      const index = list.findIndex((v) => v.id === file.uid);
      if (index > -1) {
        list.splice(index, 1);
        setAddFileCount((n) => n + 1); //代偿性+1
      }
      const newValue = Object.assign({}, componentValue, { fileIdList: list });
      onChange && onChange(newValue);
    }
  });
  const initFileList = useMemoCallback(() => {
    if (value) {
      const componentValue = typeof value === "string" ? (JSON.parse(value) as ImageValue) : { ...value };
      const { fileIdList, fileList } = componentValue;
      const list: UploadFile[] = [];
      if (fileIdList && fileIdList.length > 0) {
        const promiseList: Promise<any>[] = [];

        fileIdList.forEach(({ id }) => {
          promiseList.push(downloadFile(id));
        });
        Promise.all(promiseList).then((resList) => {
          resList.forEach(async (res, index) => {
            const file = fileIdList[index];
            const blob = new Blob([res]);
            const url: string = window.URL.createObjectURL(blob);
            list.push({
              name: file.name,
              uid: file.id,
              url: url,
              thumbUrl: url,
            });
          });
          if (fileList && fileList.length > 0) {
            fileList.forEach((val) => {
              list.push(val);
            });
          }
          setFileList(list);
        });
      }
    }
  });
  // 处理每行最多展示8张图片
  useEffect(() => {
    const el = containerRef.current!.querySelector(".ant-upload-list-picture-card");
    if (el) {
      const classNameList: string[] = [];
      el.classList.forEach((className) => {
        if (!className.includes("col-space")) {
          classNameList.push(className);
        }
      });
      classNameList.push(`col-space-${colSpace}`);
      el.className = classNameList.join(" ");
    }
  }, [colSpace]);
  useEffect(() => {
    initFileList();
  }, [initFileList]);
  useEffect(() => {
    // 后端保存的是字符串,提交时需要转成json对象
    if (typeof value === "string") {
      const componentValue = JSON.parse(value) as ImageValue;
      onChange && onChange(componentValue);
    }
  }, [value, onChange]);
  useEffect(() => {
    if (value) {
      const componentValue = typeof value === "string" ? (JSON.parse(value) as ImageValue) : { ...value };
      const { fileIdList = [] } = componentValue;
      const fileCount = fileIdList.length + addFileCount;
      const el = containerRef.current!.querySelector(".ant-upload-list-picture-card");
      const classNameList: string[] = [];
      if (el) {
        el.classList.forEach((c) => {
          if (!c.includes("overlay")) {
            classNameList.push(c);
          }
        });
        if (fileCount >= maxCount) {
          classNameList.push("overlay");
        } else {
          const index = classNameList.findIndex((v) => v === "overlay");
          index > -1 && classNameList.splice(index, 1);
        }
        el.className = classNameList.join(" ");
      }
    }
  }, [maxCount, value, addFileCount]);
  return (
    <div className={styles.image} id={props.id} ref={containerRef}>
      <Upload
        accept=".png,.jpg,.jpeg"
        listType="picture-card"
        maxCount={maxCount}
        disabled={disabled}
        fileList={fileList}
        showUploadList={{
          showDownloadIcon: true,
          showPreviewIcon: true,
          showRemoveIcon: true,
          removeIcon: <Icon type="shanchu" style={{ color: "#fff" }} />,
        }}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        onPreview={onPreview}
        onRemove={handleRemove}
      >
        {fileList.length >= maxCount ? null : (
          <span>
            <Icon type="tupian" className={styles.icon} />
            <br />
            上传图片
          </span>
        )}
      </Upload>
      <Modal
        width={800}
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        bodyStyle={{ maxHeight: "600px" }}
        onCancel={handleCancel}
      >
        <img alt={previewTitle} style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default memo(ImageComponent, (prev, current) => prev.value === current.value);
