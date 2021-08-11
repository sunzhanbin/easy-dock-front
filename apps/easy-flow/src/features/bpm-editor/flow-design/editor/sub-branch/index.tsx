import { memo, useEffect, useMemo } from 'react';
import { Form } from 'antd';
import debounce from 'lodash/debounce';
import { SubBranch as SubBranchType } from '@type/flow';
import useMemoCallback from '@common/hooks/use-memo-callback';
import Condition from '@/features/bpm-editor/components/condition';
import { FormField } from '@type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
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
    debounce((_, allValues: FormValuesType) => {
      dispatch(updateNode(Object.assign({}, branch, allValues)));
    }, 100),
  );

  useEffect(() => {
    form.setFieldsValue({
      conditions: branch.conditions,
    });
  }, [form, branch]);

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      onValuesChange={handleFormValuesChange}
      initialValues={{ conditions: branch.conditions }}
    >
      <Form.Item name="conditions" label="流转条件">
        <Condition data={fields}></Condition>
      </Form.Item>
    </Form>
  );
}

export default memo(SubBranch);
