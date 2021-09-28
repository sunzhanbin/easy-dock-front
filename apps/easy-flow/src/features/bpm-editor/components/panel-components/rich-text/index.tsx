import { memo, useState, useCallback, useMemo } from 'react';
import BraftEditor, { ControlType, EditorState } from 'braft-editor';
import { message } from 'antd';
import { batchUpload, downloadFile } from '@/apis/file';
import 'braft-editor/dist/index.css';
import styles from './index.module.scss';

interface RichTextProps {
  value?: string;
  onChange?: (value: string) => void;
}
interface UploadParams {
  file: File;
  progress: (progress: number) => void;
  libraryId: string;
  success: (res: {
    url: string;
    meta: {
      id: string;
      title: string;
      alt: string;
      loop: boolean;
      autoPlay: boolean;
      controls: boolean;
      poster: string;
    };
  }) => void;
  error: (err: { msg: string }) => void;
}

const RichText = (props: RichTextProps) => {
  const { value, onChange } = props;
  const [content, setContent] = useState<EditorState>(BraftEditor.createEditorState(value || null));
  const handleChange = useCallback(
    (value: EditorState) => {
      const __html = value.toHTML();
      onChange && onChange(__html);
      setContent(value);
    },
    [onChange],
  );
  const handleUpload: (params: UploadParams) => void = useCallback(({ file, success, error }) => {
    let fileId: string = '';
    batchUpload({ files: [file], type: 1 })
      .then((res) => {
        const id = res.data[0].id;
        if (id) {
          fileId = String(id);
          return Promise.resolve(id);
        }
        return Promise.reject('上传失败');
      })
      .then((id) => {
        return downloadFile(id);
      })
      .then((res) => {
        const blob = new Blob([res as any]);
        const url: string = window.URL.createObjectURL(blob);
        success({
          url,
          meta: {
            id: fileId,
            title: file.name,
            alt: file.name,
            loop: false,
            autoPlay: false,
            controls: false,
            poster: '',
          },
        });
      })
      .catch(() => {
        error({ msg: '上传失败' });
      });
  }, []);
  const handleValidate: (file: File) => boolean = useCallback((file) => {
    const limitSize = 1024 * 40; //文件大小，限制为5M
    if (file.size > limitSize) {
      message.error('您所上传的图片超过40kb，请调整后上传');
      return false;
    }
    return true;
  }, []);
  const controls: ControlType[] = useMemo(() => {
    return [
      'bold',
      'italic',
      'underline',
      'strike-through',
      'headings',
      'font-size',
      'text-align',
      'text-color',
      'link',
      {
        key: 'media',
        title: '图片',
      },
    ];
  }, []);
  return (
    <div className={styles.container}>
      <BraftEditor
        value={content}
        onChange={handleChange}
        media={{
          accepts: { video: false, audio: false },
          externals: { image: true, video: false, audio: false, embed: false },
          // uploadFn: handleUpload,
          validateFn: handleValidate,
        }}
        controls={controls}
        className={styles.editor}
        controlBarClassName={styles.controlBar}
        contentClassName={styles.content}
      />
    </div>
  );
};

export default memo(RichText);
