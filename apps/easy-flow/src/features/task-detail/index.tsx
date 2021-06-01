import { memo, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { Loading } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AllNode, NodeType } from '../bpm-editor/flow-design/types';
import { axios } from '@utils';
import { FormInfo } from './type';
import Form from './form-engine';
import styles from './index.module.scss';

if (process.env.NODE_ENV === 'development') {
  require('./mock');
}

type Task = {
  flow: AllNode;
  form: {
    data: FormInfo;
    value: { [key: string]: any };
  };
};

function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      axios.get<{ formDesign: FormInfo }>(`/flow/detail/${taskId}`),
      axios.get<AllNode>(`/flow/value/${taskId}`),
      axios.get<{ [key: string]: any }>(`/form/value/${taskId}`),
    ])
      .then(([formData, flowValue, formValue]) => {
        setTask({
          flow: flowValue.data,
          form: {
            data: formData.data.formDesign,
            value: formValue.data,
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [taskId]);

  const fieldsAuths = useMemo(() => {
    if (task && (task.flow.type === NodeType.FillNode || task.flow.type === NodeType.AuditNode)) {
      return task.flow.fieldsAuths;
    }

    return {};
  }, [task]);

  const formVnode = useMemo(() => {
    if (!task) return null;

    return (
      <Form
        key={taskId}
        data={task.form.data}
        initialValue={task.form.value}
        fieldsAuths={fieldsAuths}
      />
    );
  }, [task, taskId]);

  return (
    <div>
      {loading && <Loading />}

      <div className={styles.form}>{formVnode}</div>
    </div>
  );
}

export default memo(TaskDetail);
