import { memo, useRef, useEffect } from 'react';
import { Upload, message } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Icon } from '@common/components';
import styles from './index.module.scss';

const Attachment = (
  props: UploadProps & { colSpace?: string; value?: UploadFile[]; onChange?: (value: UploadFile[]) => void },
) => {
  const { maxCount = 8, colSpace = '4', value = [], onChange } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  // 校验文件类型和大小
  const checkoutFile = useMemoCallback((file: File) => {
    const { size } = file;
    const limitSize = 1024 * 1024 * 20; //5M
    if (size > limitSize) {
      message.error('文件超过20M,不允许上传~');
      return false;
    }
    return true;
  });

  const handleChange = useMemoCallback(({ file }: UploadChangeParam) => {
    const list = [...value];
    // 移除文件
    if (file.status === 'removed') {
      const index = list.findIndex((item) => item.uid === file.uid);
      list.splice(index, 1);
      onChange && onChange(list);
      return;
    }
    // 上传文件
    const validatedFile = checkoutFile((file as unknown) as File);
    if (validatedFile) {
      const fileObj = Object.assign({}, file, { originFileObj: file, percent: 100, name: file.name, type: file.type });
      console.info(file, fileObj);
      list.push(fileObj);
      onChange && onChange(list);
    }
  });
  // 阻止文件自动上传
  const handleBeforeUpload = useMemoCallback(() => {
    return false;
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
  return (
    <div className={styles.attachment} ref={containerRef}>
      <Upload
        listType="picture"
        maxCount={maxCount}
        fileList={value}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
      >
        {value.length >= maxCount ? null : (
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
