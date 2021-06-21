import { useState, useEffect } from 'react';
import { runtimeAxios } from '@utils';

type Datasource = {
  [key: string]: { key: string; value: string }[];
};

export default function useDatasource(fields: string[], versionId?: number) {
  const [datasource, setDatasource] = useState<Datasource>();

  useEffect(() => {
    if (fields.length === 0 || !versionId) return;

    const allPromises: Promise<any>[] = [];
    const values: Datasource = {};

    fields.forEach((field) => {
      allPromises.push(
        runtimeAxios
          .get<{ data: { [key: string]: string } }>(`/form/version/${versionId}/form/${field}/data`)
          .then(({ data }) => {
            const keys = Object.keys(data);

            values[field] = keys.map((key) => ({ key: key, value: data[key] }));
          }),
      );
    });

    Promise.all(allPromises).then(() => {
      setDatasource(values);
    });
  }, [fields.join(), versionId]);

  return datasource;
}
