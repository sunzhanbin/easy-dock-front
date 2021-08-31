import { memo, useCallback, useState } from 'react';
import { Upload } from 'antd';
import styles from './index.module.scss';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Icon } from '@common/components';
import { batchUpload } from '@/apis/file';

const ImageComponent = (props: UploadProps & { value?: UploadFile[]; onChange?: (value: UploadFile[]) => void }) => {
  const { maxCount = 8, value = [], onChange } = props;
  const [fileList, setFileList] = useState<UploadFile[]>(value || []);

  const handleChange = useMemoCallback(({ file, fileList: newList }: UploadChangeParam) => {
    setFileList((list) => {
      list.push((file as any).originFileObj);
      return list;
    });
    setTimeout(() => {
      onChange && onChange(fileList);
    }, 10);
  });

  const onPreview = useMemoCallback(async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow!.document.write(image.outerHTML);
  });
  const handleUpload = useMemoCallback((options: UploadRequestOption) => {
    const { file } = options;
    batchUpload({ maxUploadNum: maxCount, files: [file as File] }).then((res) => {
      console.info(res);
    });
  });
  return (
    <div className={styles.image} id={props.id}>
      {fileList.length < maxCount && (
        <Upload
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          // action="2"
          listType="picture-card"
          maxCount={maxCount}
          fileList={fileList}
          customRequest={handleUpload}
          onChange={handleChange}
          onPreview={onPreview}
        >
          <span>
            <Icon type="shangchuantupian" className={styles.icon} />
            <br />
            上传图片
          </span>
        </Upload>
      )}
    </div>
  );
};

export default memo(ImageComponent);
