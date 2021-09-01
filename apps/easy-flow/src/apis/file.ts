// 文件上传相关接口
import { runtimeAxios } from '@/utils';
export type batchUploadParams = {
  maxUploadNum: number;
  files: File[];
};
export const batchUpload = ({ maxUploadNum, files }: batchUploadParams) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return runtimeAxios.post(`/file/batchUpload?maxUploadNum=${maxUploadNum}`, formData);
};
