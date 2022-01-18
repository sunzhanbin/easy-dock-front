import { builderAxios, runtimeAxios } from "@/utils";

/**编号规则 ---start **/
export const getSerialList = (appId: number) => {
  return builderAxios.get(`id_rule/${appId}/listAll`);
};

export const deleteSerialId = (id: string) => {
  return builderAxios.delete(`id_rule/${id}`);
};

export const saveSerialRules = (params: any) => {
  return builderAxios.post("id_rule/save", params);
};

export const getSerialInfo = (id: string) => {
  return builderAxios.get(`id_rule/${id}`);
};

/**编号规则 ---end **/

/* 附件 */
export const getFilesType = () => {
  return runtimeAxios.get("common/types/doc");
};
