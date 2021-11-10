import React, { Fragment, memo, useState, useEffect } from 'react';
import { Modal, Tooltip } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from '../index.module.scss';
import { deleteSerialId, getSerialList } from '@apis/form';
import { useSubAppDetail } from '@app/app';
import { Icon } from '@common/components';
import classNames from 'classnames';
import { RuleOption } from '@type';

interface DateProps {
  showRuleModal: boolean;
  onCancel: () => void;
  onSubmit: (fieldsValue: any) => void;
}

const RuleModal = (props: DateProps) => {
  const { showRuleModal, onCancel, onSubmit } = props;
  const { data } = useSubAppDetail();
  const [ruleList, setRuleList] = useState([]);
  const [rule, setRule] = useState({});
  const [activeIndex, setActiveIndex] = useState(-1);
  const handleSubmit = useMemoCallback(() => {
    console.log(activeIndex);
    if (activeIndex === -1) return;
    onSubmit && onSubmit(rule);
  });

  const getRuleList = useMemoCallback(async () => {
    try {
      const appId = data?.app?.id;
      if (!appId) return;
      const ret = await getSerialList(appId);
      if (!ret || !ret.data) return;
      setRuleList(ret?.data);
    } catch (e) {
      console.log(e);
    }
  });

  const handleDelete = useMemoCallback(async (rule, index) => {
    try {
      const ruleId = rule.id;
      const ret = await deleteSerialId(ruleId);
      if (!ret) return;
      const list = [...ruleList];
      list.splice(index, 1);
      setRuleList(list);
      setActiveIndex(-1);
    } catch (e) {
      console.log(e);
    }
  });
  useEffect(() => {
    getRuleList();
  }, []);

  const renderLabel = useMemoCallback(() => {});

  const handleSelectRule = useMemoCallback((rule, index) => {
    console.log(rule, 'rrr');
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
    >
      <div className={styles.ruleModal}>
        {ruleList.map((rule: any, index) => (
          <div key={index} className={styles.ruleItem}>
            <div
              className={classNames(styles.name, activeIndex === index ? styles.active : '')}
              onClick={() => handleSelectRule(rule, index)}
            >
              <div className={styles.text}>{rule.name}</div>
              {renderLabel()}
            </div>
            <div className={styles.operation}>
              {rule.status === 0 && (
                <div className={styles.delete} onClick={() => handleDelete(rule, index)}>
                  <Tooltip title="删除">
                    <span>
                      <Icon className={styles.iconfont} type="shanchu" />
                    </span>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default memo(RuleModal);
