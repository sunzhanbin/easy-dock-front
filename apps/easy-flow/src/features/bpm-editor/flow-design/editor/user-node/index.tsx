import { memo, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';
import { updateNode, flowDataSelector } from '../../flow-slice';
import debounce from 'lodash/debounce';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { UserNode, AllNode } from '../../types';
import ButtonConfigs from './button-configs';
import styles from './index.module.scss';

interface UserNodeEditorProps {
  node: UserNode;
  prevNodes: AllNode[];
}

type FormValuesType = {
  name: string;
  btnConfigs: {
    btnText: UserNode['btnText'];
    revert: UserNode['revert'];
  };
};

function UserNodeEditor(props: UserNodeEditorProps) {
  const { node, prevNodes } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm<FormValuesType>();
  const formRef = useRef(null);
  const formInitialValues = useMemo(() => {
    return {
      name: node.name,
      btnConfigs: {
        btnText: node.btnText,
        revert: node.revert,
      },
    };
  }, [node]);

  const handleFormValuesChange = useMemoCallback(
    debounce((_, allValues: FormValuesType) => {
      dispatch(
        updateNode({
          ...node,
          name: allValues.name,
          btnText: allValues.btnConfigs.btnText,
          revert: allValues.btnConfigs.revert,
        }),
      );
    }, 100),
  );

  return (
    <div>
      <Form
        ref={formRef}
        form={form}
        layout="vertical"
        initialValues={formInitialValues}
        onValuesChange={handleFormValuesChange}
        autoComplete="off"
      >
        <Form.Item label="节点名称" name="name">
          <Input size="large" placeholder="请输入用户节点名称" />
        </Form.Item>

        <div>
          <div className={styles.title}>操作权限</div>
          <Form.Item label="" name="btnConfigs">
            <ButtonConfigs prevNodes={prevNodes} />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}

export default memo(UserNodeEditor);
