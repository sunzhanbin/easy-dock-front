// 文件上传相关接口
import { runtimeAxios } from '@/utils';
export type batchUploadParams = {
  files: File[];
};
export const batchUpload = ({ files }: batchUploadParams) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return runtimeAxios.post(`/file/batchUpload`, formData);
};

export const downloadFile = (id: string) => {
  return runtimeAxios.get(`/file/download/${id}`, { responseType: 'blob' });
};
