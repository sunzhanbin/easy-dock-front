import { runtimeAxios } from '@utils/axios';
import { AuthType, FieldAuthsMap } from '@type/flow';
import type { TaskDetailType, FlowMeta, FormMeta, FormValue, FlowInstance, Datasource } from '@type/detail';
import { CheckboxField, RadioField, SelectField } from '@/type';

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

export async function loadDatasource(formMeta: FormMeta, fieldsAuths: FieldAuthsMap, versionId: number) {
  const allPromises: Promise<void>[] = [];
  const datasource: Datasource = {};

  formMeta.components.forEach((comp) => {
    // 有字段权限才去加载
    if (comp.config.dataSource && (fieldsAuths && fieldsAuths[comp.config.fieldName] !== AuthType.Denied)) {
      allPromises.push(
        runtimeAxios
          .get<{ data: Datasource[string] }>(`/form/version/${versionId}/form/${comp.config.fieldName}/data`)
          .then(({ data }) => {
            datasource[comp.config.fieldName] = data;
          }),
      );
    }
  });

  await Promise.all(allPromises);

  return datasource;
}

export async function fetchDataSource(components: Array<RadioField | CheckboxField | SelectField>) {
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
      }
    }
  });
  await Promise.all(allPromises);
  return source;
}
