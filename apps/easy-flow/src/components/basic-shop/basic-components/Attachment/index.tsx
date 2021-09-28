import { memo, useRef, useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Icon } from '@common/components';
import styles from './index.module.scss';
import { downloadFile } from '@utils';

type FileValue = {
  type: 'Attachment';
  fileIdList?: { id: string; name: string; mimeType: string }[];
  fileList?: UploadFile[];
};

const Attachment = (
  props: UploadProps & { colSpace?: string; value?: FileValue; onChange?: (value: FileValue) => void },
) => {
  const { maxCount = 5, colSpace = '4', value, disabled, onChange } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // 校验文件类型和大小
  const checkoutFile = useMemoCallback((file: File) => {
    const { size } = file;
    const limitSize = 1024 * 1024 * 20; //20M
    if (size > limitSize) {
      message.error('您所上传的图片超过20M，请调整后上传');
      return false;
    }
    return true;
  });

  const handleChange = useMemoCallback(({ file }: UploadChangeParam) => {
    const list = [...fileList];
    // 移除文件
    if (file.status === 'removed') {
      const index = list.findIndex((item) => item.uid === file.uid);
      list.splice(index, 1);
      const newValue = Object.assign({}, value, { fileList: list, type: 'Attachment' });
      setFileList(list);
      onChange && onChange(newValue);
      return;
    }
    // 上传文件
    const validatedFile = checkoutFile((file as unknown) as File);
    if (validatedFile) {
      const fileObj = Object.assign({}, file, { originFileObj: file, percent: 100, name: file.name, type: file.type });
      list.push(fileObj);
      const newValue = Object.assign({}, value, { fileList: list, type: 'Attachment' });
      setFileList(list);
      onChange && onChange(newValue);
    }
  });
  // 阻止文件自动上传
  const handleBeforeUpload = useMemoCallback(() => {
    return false;
  });
  const handleDownload = useMemoCallback((file: UploadFile) => {
    const { name, uid } = file;
    downloadFile(uid, name);
  });
  const handleRemove = useMemoCallback((file) => {
    if (value) {
      const componentValue = typeof value === 'string' ? (JSON.parse(value) as FileValue) : { ...value };
      const { fileIdList = [], fileList = [] } = componentValue;
      const list = [...fileIdList];
      const index = list.findIndex((v) => v.id === file.uid);
      index > -1 && list.splice(index, 1);
      const newValue = Object.assign({}, componentValue, { fileIdList: list });
      onChange && onChange(newValue);
    }
  });
  const initFileList = useMemoCallback(() => {
    if (value) {
      const componentValue = typeof value === 'string' ? (JSON.parse(value) as FileValue) : { ...value };
      const { fileIdList, fileList } = componentValue;
      const list: UploadFile[] = [];
      if (fileIdList && fileIdList.length > 0) {
        fileIdList.forEach((file) => {
          list.push({
            name: file.name,
            uid: file.id,
            thumbUrl: '',
            status: 'done',
            type: file.mimeType || 'text/plain',
          });
        });
        if (fileList && fileList.length > 0) {
          fileList.forEach((val) => {
            list.push(val);
          });
        }
        setFileList(list);
      }
    }
  });
  // 处理每行最多展示4个文件
  useEffect(() => {
    const el = containerRef.current!.querySelector('.ant-upload-select-picture')?.parentElement;
    if (el) {
      const classNameList: string[] = [];
      el.classList.forEach((className) => {
        if (!className.includes('col-space')) {
          classNameList.push(className);
        }
      });
      classNameList.push(`col-space-${colSpace}`);
      el.className = classNameList.join(' ');
    }
  }, [colSpace]);
  useEffect(() => {
    initFileList();
  }, [initFileList]);
  useEffect(() => {
    // 后端保存的是字符串,提交时需要转成json对象
    if (typeof value === 'string') {
      const componentValue = JSON.parse(value) as FileValue;
      onChange && onChange(componentValue);
    }
  }, [value, onChange]);
  return (
    <div className={styles.attachment} ref={containerRef}>
      <Upload
        listType="picture"
        disabled={disabled}
        maxCount={maxCount}
        fileList={fileList}
        iconRender={() => <Icon type="wendangshangchuan" className={styles['file-icon']} />}
        isImageUrl={() => false}
        showUploadList={{
          showDownloadIcon: true,
          showRemoveIcon: true,
        }}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        onDownload={handleDownload}
        onRemove={handleRemove}
      >
        {fileList.length >= maxCount ? null : (
          <span>
            <Icon type="fujiancaidan" className={styles.icon} />
            上传附件
          </span>
        )}
      </Upload>
    </div>
  );
};

export default memo(Attachment);
