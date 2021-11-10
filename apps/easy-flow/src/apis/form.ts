import { builderAxios } from '@/utils';

/**编号规则 ---start **/
export const getSerialList = (appId: number) => {
  return builderAxios.get(`id_rule/${appId}/listAll`);
};

export const deleteSerialId = (id: number) => {
  return builderAxios.delete(`id_rule/${id}`);
};

export const saveSerialRules = (params: any) => {
  return builderAxios.post('id_rule/save', params);
};
/**编号规则 ---end **/
