import { runtimeAxios } from '@utils/axios';
import { AuthType, FieldAuthsMap } from '@type/flow';
import type { TaskDetailType, FlowMeta, FormMeta, FormValue, FlowInstance, Datasource } from '@type/detail';
import { CheckboxField, RadioField, SelectField, UrlOptionItem } from '@/type';
import { urlRegex } from '@/features/bpm-editor/form-design/validate';

export async function loadFlowData(
  flowIns: FlowInstance,
  type?: TaskDetailType.MyInitiation,
): Promise<[FormMeta, FormValue, FlowMeta]> {
  return await Promise.all([
    // 表单元数据
    runtimeAxios.get(`/form/version/${flowIns.subapp.version.id}`).then(({ data }) => {
      return data.meta;
    }),
    // 用户填写的表单数据
    runtimeAxios
      .post('/task/getFormData', {
        processInstanceId: flowIns.processInstanceId,
        type: type,
        key: flowIns.currentNodeId,
      })
      .then(({ data }) => JSON.parse(data)),
    // 流程节点元数据
    runtimeAxios
      .post<{ data: string }>(`/process_instance/getProcessNodeMeta`, {
        processInstanceId: flowIns.processInstanceId,
        type: type,
        key: flowIns.currentNodeId,
      })
      .then(({ data }) => JSON.parse(data)),
  ]);
}

export async function loadDatasource(
  formMeta: FormMeta,
  fieldsAuths: FieldAuthsMap,
  versionId: number,
  processInstanceId?: string,
) {
  const allPromises: Promise<void>[] = [];
  const datasource: Datasource = {};
  formMeta.components.forEach((comp) => {
    // 有字段权限才去加载
    if (comp.config.dataSource && fieldsAuths && fieldsAuths[comp.config.fieldName] !== AuthType.Denied) {
      allPromises.push(
        runtimeAxios
          .post<{ data: Datasource[string] }>(`/form/version/${versionId}/form/${comp.config.fieldName}/data`, {
            processInstanceId,
          })
          .then(({ data }) => {
            datasource[comp.config.fieldName] = data;
          })
          .catch(() => {
            // 如果调用接口出错,则数据源设为空数组,防止页面崩溃
            datasource[comp.config.fieldName] = [];
          }),
      );
    }
  });

  await Promise.all(allPromises);

  return datasource;
}

export async function fetchDataSource(
  components: Array<RadioField | CheckboxField | SelectField>,
  formDataList?: { name: string; value: any }[],
) {
  const allPromises: Promise<void>[] = [];
  const source: Datasource = {};
  components.forEach(async (object) => {
    if (object?.dataSource) {
      const key = object.fieldName || object.id || '';
      const { dataSource } = object;
      if (dataSource.type === 'custom') {
        allPromises.push(
          Promise.resolve(dataSource.data).then((data) => {
            if (data) {
              source[key] = data;
            }
          }),
        );
      } else if (dataSource.type === 'subapp') {
        const { fieldName = '', subappId = '' } = dataSource;
        if (fieldName && subappId) {
          allPromises.push(
            runtimeAxios.get(`/subapp/${subappId}/form/${fieldName}/data`).then((res) => {
              const list = (res.data?.data || []).map((val: string) => ({ key: val, value: val }));
              source[key] = list;
            }),
          );
        }
      } else if (dataSource.type === 'interface') {
        const { apiConfig } = dataSource;
        if (apiConfig && formDataList) {
          const formValues: { [k: string]: any } = {};
          formDataList?.forEach((v) => {
            formValues[v.name] = v.value;
          });
          const required = apiConfig.request.required;
          const custom = apiConfig.request.customize;
          const requestFields = required
            .concat(custom)
            .map((item) => {
              const { map } = item;
              if (!map) {
                return '';
              }
              return String(map?.match(/(?<=\$\{).*?(?=\})/));
            })
            .filter((name) => !name);
          const isEmpty =
            requestFields.length > 0 &&
            requestFields.some((name) => formValues[name] === undefined || formValues[name] === null);
          // 只要入参中有一个没有值，则不调用接口
          if (isEmpty) {
            allPromises.push(
              Promise.resolve(1).then(() => {
                source[key] = [];
              }),
            );
            return;
          }
          const name = (apiConfig.response as { name: string })?.name;
          const formData = formDataList?.filter((val) => val.value) || [];
          if (name) {
            allPromises.push(
              runtimeAxios.post('/common/doHttpJson', { meta: apiConfig, formDataList: formData }).then((res) => {
                const data = eval(`res.${name}`);
                let list: { key: string; value: string }[] = [];
                if (Array.isArray(data)) {
                  if (data.every((val) => typeof val === 'string')) {
                    // 字符串数组
                    list = data.map((val) => ({ key: val, value: val }));
                  } else if (data.every((val) => val.key && val.value)) {
                    // key-value对象数组
                    list = data.map((item) => ({ key: item.key, value: item.value }));
                  }
                }
                source[key] = list;
              }),
            );
          } else {
            allPromises.push(
              Promise.resolve(1).then(() => {
                source[key] = [];
              }),
            );
          }
        } else {
          allPromises.push(
            Promise.resolve(1).then(() => {
              source[key] = [];
            }),
          );
        }
      }
    }
  });
  await Promise.all(allPromises);
  return source;
}

export const deleteDraft = async (draftId: number | string) => {
  await runtimeAxios.delete(`task/draft/${draftId}`);
};

export const getFlowData = (params: any) => {
  return runtimeAxios.post('', params);
};

export const loadSrc = async (option: UrlOptionItem, formDataList?: { name: string; value: any }[]) => {
  if (option?.type === 'custom') {
    if (option.customValue && urlRegex.test(option.customValue)) {
      return option.customValue;
    }
    return '';
  }
  if (option?.type === 'interface') {
    const { apiConfig } = option;
    if (!apiConfig) {
      return '';
    }
    const formValues: { [k: string]: any } = {};
    formDataList?.forEach((v) => {
      formValues[v.name] = v.value;
    });
    const required = apiConfig.request.required;
    const custom = apiConfig.request.customize;
    const requestFields = required
      .concat(custom)
      .map((item) => {
        const { map } = item;
        if (!map) {
          return '';
        }
        return String(map?.match(/(?<=\$\{).*?(?=\})/));
      })
      .filter((name) => !name);
    const isEmpty =
      requestFields.length > 0 &&
      requestFields.some((name) => formValues[name] === undefined || formValues[name] === null);
    // 只要入参中有一个没有值，就不调用接口
    if (isEmpty) {
      return '';
    }
    const name = (apiConfig.response as { name: string })?.name;
    if (!name) {
      return '';
    }
    const formData = formDataList?.filter((val) => val.value) || [];
    try {
      const res = await runtimeAxios.post('/common/doHttpJson', { meta: apiConfig, formDataList: formData });
      return eval(`res.${name}`);
    } catch (error) {
      return '';
    }
  }
  return '';
};
