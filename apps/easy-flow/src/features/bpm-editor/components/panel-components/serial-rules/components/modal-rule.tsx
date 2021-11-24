import React, { memo, useState, useEffect } from 'react';
import { message, Modal, Popconfirm } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from '../index.module.scss';
import { deleteSerialId, getSerialList } from '@apis/form';
import { useSubAppDetail } from '@app/app';
import { Icon } from '@common/components';
import classNames from 'classnames';
import { RuleOption } from '@type';

interface RuleProps {
  fields: { id: string; name: string }[];
  showRuleModal: boolean;
  onCancel: () => void;
  onSubmit: (fieldsValue: any) => void;
}

const RuleModal = (props: RuleProps) => {
  const { showRuleModal, onCancel, onSubmit, fields } = props;
  const { data } = useSubAppDetail();
  const [ruleList, setRuleList] = useState([]);
  const [rule, setRule] = useState({});
  const [activeIndex, setActiveIndex] = useState(-1);
  const handleSubmit = useMemoCallback(() => {
    if (activeIndex === -1) {
      return message.warning('请选择规则');
    }
    onSubmit && onSubmit(rule);
  });

  const getRuleList = useMemoCallback(async () => {
    try {
      const appId = data?.app?.id;
      if (!appId) return;
      const ret = await getSerialList(appId);
      setRuleList(ret?.data || []);
    } catch (e) {
      console.log(e);
    }
  });

  const handleDelete = useMemoCallback(async (rule, index) => {
    try {
      const ruleId = rule.id;
      await deleteSerialId(ruleId);
      message.success('删除成功');
      const list = [...ruleList];
      list.splice(index, 1);
      setRuleList(list);
      setActiveIndex(-1);
    } catch (e) {
      console.log(e);
    }
  });
  useEffect(() => {
    (() => getRuleList())();
  }, [getRuleList]);

  const renderLabel = useMemoCallback((rule) => {
    return rule.mata.map((item: RuleOption) => {
      if (item.type === 'incNumber') {
        return <span>{Math.pow(10, item.digitsNum)}</span>;
      }
      if (item.type === 'createTime') {
        return <span>{item.format}</span>;
      }
      if (item.type === 'fixedChars') {
        return <span>{item.chars}</span>;
      }
      if (item.type === 'fieldName') {
        return <span>{fields.find((field) => field.id === item.fieldValue)?.name}</span>;
      }
      return null;
    });
  });

  const handleSelectRule = useMemoCallback((rule, index) => {
    setActiveIndex(index);
    setRule(rule);
  });
  return (
    <Modal
      width={500}
      visible={showRuleModal}
      title={'选择规则'}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="确 认"
      cancelText="取 消"
      cancelButtonProps={{ type: 'text', size: 'large' }}
      okButtonProps={{ size: 'large' }}
      destroyOnClose={true}
      maskClosable={false}
      getContainer={false}
    >
      <div className={styles.ruleModal}>
        {ruleList.map((rule: any, index) => (
          <div key={index} className={styles.ruleItem}>
            <div
              className={classNames(styles.name, activeIndex === index ? styles.active : '')}
              onClick={() => handleSelectRule(rule, index)}
            >
              <div className={styles.text}>{rule.name}</div>
              <span className={styles.ruleTips}>{renderLabel(rule)}</span>
            </div>
            <div className={styles.operation}>
              {rule.status === 0 && (
                <Popconfirm
                  title="确定要删除此条规则吗?"
                  okText="确 定"
                  placement="right"
                  icon={null}
                  cancelText="取 消"
                  onConfirm={() => handleDelete(rule, index)}
                >
                  <div className={styles.delete}>
                    <Icon className={styles.iconfont} type="shanchu" />
                  </div>
                </Popconfirm>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default memo(RuleModal);
