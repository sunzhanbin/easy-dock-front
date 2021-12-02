import React, { memo, useState, useEffect } from 'react';
import { message, Modal, Popconfirm, Tooltip } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from '../index.module.scss';
import { deleteSerialId, getSerialList } from '@apis/form';
import { useSubAppDetail } from '@app/app';
import { Icon } from '@common/components';
import classNames from 'classnames';
import { RuleOption } from '@type';
import { RULE_TYPE } from '@utils/const';

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

  const formatComponent: { [key: string]: (props: any) => React.ReactNode } = {
    incNumber: (item) => {
      let digitsNum = '00000';
      digitsNum = digitsNum.substr(digitsNum.length - 5, item.digitsNum - 1) + 1;
      return <span>{digitsNum}</span>;
    },
    createTime: (item) => <span>{item.format}</span>,
    fixedChars: (item) => <span>{item.chars}</span>,
    fieldName: (item) => {
      const fieldName = fields.find((field) => field.id === item.fieldValue)?.name;
      return <span> {fieldName ? '${' + fieldName + '}' : ''}</span>;
    },
  };

  const renderLabel = useMemoCallback((rule) => {
    return rule.mata.map((item: RuleOption, index: number) => {
      return (
        <React.Fragment key={index}>{RULE_TYPE.includes(item.type) && formatComponent[item.type](item)}</React.Fragment>
      );
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
          <div key={rule.id} className={styles.ruleItem}>
            <div
              className={classNames(styles.name, activeIndex === index ? styles.active : '')}
              onClick={() => handleSelectRule(rule, index)}
            >
              <Tooltip title={rule.name}>
                <div className={styles.text}>{rule.name}</div>
              </Tooltip>
              <Tooltip title={renderLabel(rule)}>
                <span className={styles.ruleTips}>{renderLabel(rule)}</span>
              </Tooltip>
            </div>
            <div className={styles.operation}>
              {rule.status !== 0 ? (
                <Tooltip title="该规则已被使用，不可删除">
                  <div className={classNames(styles.delete, styles.disable)}>
                    <Icon className={styles.iconfont} type="shanchu" />
                  </div>
                </Tooltip>
              ) : (
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
