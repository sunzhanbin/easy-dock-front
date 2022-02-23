import { memo, useState, useCallback } from "react";
import { Editor as RichText } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "./index.module.scss";

interface EditProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Editor = (props: EditProps) => {
  const { value, onChange } = props;
  const [content, setContent] = useState<EditorState>(() => {
    if (value) {
      const { contentBlocks, entityMap } = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });
  const handleChange = useCallback(
    (content) => {
      const currentContent: ContentState = content.getCurrentContent();
      const raw = convertToRaw(currentContent);
      const _html = draftToHtml(raw);
      onChange && onChange(_html);
      setContent(content);
    },
    [onChange],
  );
  return (
    <div className={styles.container}>
      <RichText
        toolbar={{
          options: ["inline", "blockType", "fontSize", "textAlign", "colorPicker", "link", "image"],
          inline: {
            className: "inline_wrap",
            options: ["bold", "italic", "underline", "strikethrough"],
          },
          blockType: {
            inDropdown: true,
            options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
            className: "block_wrap",
          },
          fontSize: {
            className: "fontsize_wrap",
          },
          textAlign: {
            className: "align_wrap",
          },
          colorPicker: {
            popupClassName: "color_pop",
          },
          link: {
            options: ["link"],
            popupClassName: "link_pop",
          },
          image: {
            popupClassName: "image_pop",
          },
        }}
        wrapperClassName="wrapper_class"
        editorClassName="editor_class"
        toolbarClassName="toolbar_class"
        editorState={content}
        onEditorStateChange={handleChange}
      ></RichText>
    </div>
  );
};

export default memo(Editor);
