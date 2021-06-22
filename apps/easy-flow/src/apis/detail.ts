import { runtimeAxios } from '@utils/axios';
import { AuthType } from '@type/flow';
import type { TaskDetailType, FlowMeta, FormMeta, FormValue, FlowInstance, Datasource } from '@type/detail';

export async function loadFlowData(
  flowIns: FlowInstance,
  type: TaskDetailType,
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

export async function loadDatasource(formMeta: FormMeta, flowMeta: FlowMeta, versionId: number) {
  const allPromises: Promise<void>[] = [];
  const datasource: Datasource = {};
  const auths = flowMeta.fieldsAuths;

  formMeta.components.forEach((comp) => {
    // 有字段权限才去加载
    if (comp.config.dataSource && auths[comp.config.fieldName] !== AuthType.Denied) {
      allPromises.push(
        runtimeAxios
          .get<{ data: { [key: string]: string } }>(`/form/version/${versionId}/form/${comp.config.fieldName}/data`)
          .then(({ data }) => {
            const keys = Object.keys(data);

            datasource[comp.config.fieldName] = keys.map((key) => ({ key: key, value: data[key] }));
          }),
      );
    }
  });

  await Promise.all(allPromises);

  return datasource;
}
