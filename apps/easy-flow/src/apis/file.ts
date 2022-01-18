// 文件上传相关接口
import { runtimeAxios } from "@/utils";

export type batchUploadParams = {
  type: 1 | 2; //1-图片控件 2-附件控件
  files: File[];
};
export const batchUpload = ({ files, type }: batchUploadParams) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  return runtimeAxios.post(`/file/batchUpload?controlType=${type}`, formData);
};

export const downloadFile = (id: string) => {
  return runtimeAxios.get(`/file/download/${id}`, { responseType: "blob" });
};
