import { memo, useEffect, useMemo } from 'react';
import { Form } from 'antd';
import debounce from 'lodash/debounce';
import { FormField, SelectField } from '@type';
import { SubBranch as SubBranchType } from '@type/flow';
import useMemoCallback from '@common/hooks/use-memo-callback';
import Condition from '@/features/bpm-editor/components/condition';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadFieldDatasource } from '@utils/form';
import useValidateForm from '../../hooks/use-validate-form';
import { updateNode, formMetaSelector } from '../../flow-slice';

type FormValuesType = {
  conditions: SubBranchType['conditions'];
};

interface SubBranchProps {
  branch: SubBranchType;
}

function SubBranch(props: SubBranchProps) {
  const { branch } = props;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const formMeta = useAppSelector(formMetaSelector);
  const fields = useMemo(() => {
    if (!formMeta) return [];

    return formMeta.components.map((field) => {
      return Object.assign({}, field.config, field.props) as FormField;
    });
  }, [formMeta]);

  const handleFormValuesChange = useMemoCallback(
    debounce(() => {
      const formValues = form.getFieldsValue();
      dispatch(updateNode(Object.assign({}, branch, formValues)));
    }, 100),
  );

  const handleLoadDatasource = useMemoCallback((name: string) => {
    const dataSource = (fields.find((field) => field.fieldName === name) as SelectField).dataSource;
    return loadFieldDatasource(dataSource);
  });

  useEffect(() => {
    form.setFieldsValue({
      conditions: branch.conditions,
    });
  }, [form, branch]);

  useValidateForm<FormValuesType>(form, branch.id);

  return (
    <Form form={form} autoComplete="off" layout="vertical" onValuesChange={handleFormValuesChange}>
      <Form.Item name="conditions" label="流转条件">
        <Condition data={fields} showTabs={false} name="conditions" loadDataSource={handleLoadDatasource}></Condition>
      </Form.Item>
    </Form>
  );
}

export default memo(SubBranch);
