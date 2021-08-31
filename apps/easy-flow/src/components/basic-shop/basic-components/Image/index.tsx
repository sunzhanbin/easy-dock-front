import { memo, useCallback } from 'react';
import { Upload } from 'antd';
import styles from './index.module.scss';
import cookie from 'js-cookie';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { UploadRequestOption } from 'rc-upload/lib/interface';
// import { runtimeAxios } from '@/utils';
// import { batchUpload } from '@/apis/file';

// const token = cookie.get('token') || '';

const Image = (props: UploadProps & { value?: UploadFile[] }) => {
  const { maxCount = 8, value = [], onChange } = props;
  // console.info(props, 'props');

  const handleChange = ({ fileList }: UploadChangeParam) => {
    // setFileList(newFileList);
    // onChange && onChange({ fileList });
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    // const image = new Image();
    // image.src = src;
    // const imgWindow = window.open(src);
    // imgWindow!.document.write(image.outerHTML);
  };
  const handleUpload = useCallback(
    (options: UploadRequestOption) => {
      const { file } = options;
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob); // 读取图片文件
      reader.onload = (file) => {
        // console.info(file);
      };
      // batchUpload({ maxUploadNum: 8, files: [file] }).then((res) => {
      //   console.info(res);
      // });
      // console.info(value, 'value', options);
    },
    [value],
  );
  return (
    <div className={styles.image} id={props.id}>
      <Upload
        // id={props.id}
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        // action={`${window.EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/runtime/v1/file/batchUpload}`}
        // headers={{ auth: token }}
        listType="picture-card"
        fileList={value}
        customRequest={handleUpload}
        onChange={handleChange}
        onPreview={onPreview}
      >
        {value.length < maxCount && '+ Upload'}
      </Upload>
    </div>
  );
};

export default memo(Image);
