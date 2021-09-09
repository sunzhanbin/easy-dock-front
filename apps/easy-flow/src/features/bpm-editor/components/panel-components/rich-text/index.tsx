import { memo, useState, useCallback, useMemo } from 'react';
import BraftEditor, { ControlType, EditorState } from 'braft-editor';
import styles from './index.module.scss';
import 'braft-editor/dist/index.css';

interface RichTextProps {
  value?: string;
  onChange?: (value: string) => void;
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
        controls={controls}
        className={styles.editor}
        controlBarClassName={styles.controlBar}
        contentClassName={styles.content}
      />
    </div>
  );
};

export default memo(RichText);
