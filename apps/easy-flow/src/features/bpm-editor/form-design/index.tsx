import { FC, memo, useEffect } from "react";
import { useParams } from "react-router";
import DesignZone from "./design-zone";
import ToolBox from "./toolbox";
import EditZone from "./edit-zone";
import { loadFormData } from "./formdesign-slice";
import { useAppDispatch } from "@/app/hooks";
import { axios } from "@/utils";
import styles from "./index.module.scss";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const FormDesign: FC<any> = () => {
  const dispatch = useAppDispatch();
  const { bpmId: subAppId } = useParams<{ bpmId: string }>();

  useEffect(() => {
    // 初始化表单数据
    axios.get(`/form/${subAppId}`).then(async (res) => {
      const { meta } = res.data;
      await dispatch(loadFormData({ formData: meta, isDirty: false }));
    });
  }, [subAppId, dispatch]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.container}>
          <ToolBox></ToolBox>
          <DesignZone></DesignZone>
          <EditZone></EditZone>
        </div>
      </DndProvider>
    </>
  );
};

export default memo(FormDesign);
