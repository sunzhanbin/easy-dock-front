import { memo, useRef, useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Icon } from '@common/components';
import { downloadFile } from '@utils';
import styles from './index.module.scss';

type FileValue = {
  type: 'Attachment';
  fileIdList?: { id: string; name: string; mimeType: string }[];
  fileList?: UploadFile[];
};

type TypeRestrictProps = {
  enable?: boolean;
  types?: string[];
  custom?: string[];
};

const Attachment = (
  props: UploadProps & { colSpace?: string; value?: FileValue; onChange?: (value: FileValue) => void } & {
    typeRestrict: TypeRestrictProps;
  } & { fileMap: { [key: string]: string[] } },
) => {
  const { maxCount = 5, colSpace = '4', value, disabled, onChange, fileMap, typeRestrict } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileTypeList, setFileTypeList] = useState<string[]>([]);
  // 校验文件类型和大小
  const checkoutFile = useMemoCallback((file: File) => {
    const { size, name } = file;
    const extension = name.replace(/.+\./, '.');
    if (!name || (fileTypeList?.length && !fileTypeList.includes(extension))) {
      message.error('当前文件上传类型有误，请重新上传');
      return false;
    }
    const limitSize = 1024 * 1024 * 20; //20M
    if (size > limitSize) {
      message.error('您所上传的图片超过20M，请调整后上传');
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!typeRestrict || !typeRestrict.enable || !fileMap) {
      return;
    }
    const { types, custom = [] } = typeRestrict;
    const exceptCustom: string[] = types?.filter((item) => item !== 'custom') || [];
    const fileTypeList = Object.entries(fileMap)
      ?.map(([key, value]: any) => {
        if (exceptCustom.includes(key)) {
          return value?.map((item: string) => `.${item}`);
        }
        return undefined;
      })
      .flat(2)
      .filter(Boolean);
    const customList = custom.map((item) => `.${item}`);
    const typeList = [...new Set(fileTypeList.concat(customList))];
    setFileTypeList(typeList);
  }, [fileMap, typeRestrict]);

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
      const { fileIdList = [] } = componentValue;
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
        accept={fileTypeList?.join(',')}
        listType="picture"
        disabled={disabled}
        maxCount={maxCount}
        fileList={fileList}
        iconRender={() => <Icon type="wendangshangchuan" className={styles['file-icon']} />}
        isImageUrl={() => false}
        showUploadList={{
          showDownloadIcon: true,
          showRemoveIcon: true,
          removeIcon: <Icon type="shanchu" />,
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
