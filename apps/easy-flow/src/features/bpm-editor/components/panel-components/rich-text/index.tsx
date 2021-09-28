import { memo, useState, useCallback, useMemo } from 'react';
import BraftEditor, { ControlType, EditorState } from 'braft-editor';
import { message } from 'antd';
import { batchUpload, downloadFile as download } from '@/apis/file';
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
    batchUpload({ files: [file], type: 1 }).then((res) => {
      console.info(res, 111);
    });
  }, []);
  const handleValidate: (file: File) => boolean = useCallback((file) => {
    const limitSize = 1024 * 40; //文件大小，限制为40kb
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
      'media',
    ];
  }, []);
  return (
    <div className={styles.container}>
      <BraftEditor
        value={content}
        onChange={handleChange}
        media={{ accepts: { video: false, audio: false }, validateFn: handleValidate }}
        controls={controls}
        className={styles.editor}
        controlBarClassName={styles.controlBar}
        contentClassName={styles.content}
      />
    </div>
  );
};

export default memo(RichText);
