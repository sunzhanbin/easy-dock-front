import React, { memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Editor as RichText } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Container = styled.div`
  .wrapper_class {
    .toolbar_class {
      .inline_wrap {
        .rdw-option-wrapper {
          padding: 5px 3px;
          min-width: 16px;
          height: 30px;
        }
      }
      .block_wrap {
        width: 76px;
        font-size: 13px;
      }
      .fontsize_wrap {
        width: 48px;
      }
      .align_wrap {
        .rdw-option-wrapper {
          width: 30px;
          height: 30px;
        }
      }
      .rdw-colorpicker-wrapper,
      .rdw-link-wrapper,
      .rdw-image-wrapper {
        .rdw-option-wrapper {
          width: 30px;
          height: 30px;
        }
      }
      .color_pop {
        left: -6px;
        width: 218px;
        height: 200px;
        .rdw-colorpicker-modal-options {
          overflow: auto;
        }
      }
      .link_pop {
        left: -44px;
        width: 218px;
        height: 220px;
      }
      .image_pop {
        left: -82px;
        width: 218px;
      }
    }
    .editor_class {
      border: 1px solid #f1f1f1;
      .public-DraftStyleDefault-block {
        margin: 8px;
        line-height: 24px;
        min-height: 64px;
      }
    }
  }
`;
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
    <Container>
      <RichText
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'textAlign', 'colorPicker', 'link', 'image'],
          inline: {
            className: 'inline_wrap',
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            className: 'block_wrap',
          },
          fontSize: {
            className: 'fontsize_wrap',
          },
          textAlign: {
            className: 'align_wrap',
          },
          colorPicker: {
            popupClassName: 'color_pop',
          },
          link: {
            options: ['link'],
            popupClassName: 'link_pop',
          },
          image: {
            popupClassName: 'image_pop',
          },
        }}
        wrapperClassName="wrapper_class"
        editorClassName="editor_class"
        toolbarClassName="toolbar_class"
        editorState={content}
        onEditorStateChange={handleChange}
      ></RichText>
    </Container>
  );
};

export default memo(Editor);
