import { memo, useEffect } from 'react';
import { Form } from 'antd';
import debounce from 'lodash/debounce';
import { SubBranch as SubBranchType } from '@type/flow';
import useMemoCallback from '@common/hooks/use-memo-callback';
import Condition from '@components/condition';
import { useAppDispatch } from '@/app/hooks';
import { updateNode } from '../../flow-slice';

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
    <Form form={form} autoComplete="off" layout="vertical" onValuesChange={handleFormValuesChange}>
      <Form.Item name="conditions" label="流转条件">
        <Condition></Condition>
      </Form.Item>
    </Form>
  );
}

export default memo(SubBranch);
