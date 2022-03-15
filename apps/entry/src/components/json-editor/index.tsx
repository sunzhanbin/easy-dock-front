import JSONEditor, { JSONEditorOptions } from "jsoneditor";
import React, { memo, useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import "@components/json-editor/index.style.scss";

const JsonEditor = (_: any, ref: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState<JSONEditor>();

  useEffect(() => {
    const options: JSONEditorOptions = {
      language: "zh-CN",
      mode: "code",
      mainMenuBar: false,
      navigationBar: false,
    };
    const jsonEditor = new JSONEditor(containerRef.current!, options);
    setEditor(jsonEditor);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      add: (json: any) => {
        editor?.set(json);
      },
      close: () => {
        editor?.destroy();
      },
      expandAll: () => {
        editor?.expandAll();
      },
    }),
    [editor],
  );

  return <div className="json-editor-container" ref={containerRef} />;
};

export default memo(forwardRef(JsonEditor));
