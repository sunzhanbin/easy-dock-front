// 文件上传相关接口
import { runtimeAxios } from '@/utils';
export type batchUploadParams = {
  maxUploadNum: number;
  files: any;
};
export const batchUpload = ({ maxUploadNum, files }: batchUploadParams) => {
  return runtimeAxios.post(`/file/batchUpload?maxUploadNum=${maxUploadNum}`, { files });
};
