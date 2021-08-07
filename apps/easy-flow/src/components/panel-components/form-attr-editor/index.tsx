import { memo, useState, useCallback } from 'react';
import { Button, Tooltip } from 'antd';
// import { FormRuleItem } from '@/type';
import { formatCondition } from '@/utils';
import { Icon } from '@common/components';
import FormAttrModal from '../form-attr-modal';
import styles from './index.module.scss';

const FormAttrEditor = () => {
  //   const [rules, setRules] = useState<FormRuleItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);
  const handleClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);
  const handleOk = useCallback(
    (rules) => {
      const condition = formatCondition(rules.ruleValue);
      console.info(condition);
      setShowModal(false);
    },
    [setShowModal],
  );
  return (
    <div className={styles.container}>
      <div className={styles.rules}>
        <div className={styles.title}>表单逻辑规则</div>
        <div className={styles.content}>
          {/* {rules.map((item: FormRuleItem, index: number) => (
            <div className={styles.ruleItem} key={index}>
              <span>当</span>
              <span>{item.filedName}</span>
              <span>
                {item.symbol}
                {item.value}时
              </span>
              {item.showComponents.length > 0 && <span>{`显示${item.showComponents.join('、')}`}</span>}
              {item.hideComponents.length > 0 && <span>{`隐藏${item.hideComponents.join('、')}`}</span>}
            </div>
          ))} */}
          <div className={styles.ruleItem}>
            <div className={styles.content}>
              <span>当</span>
              <span className={styles.filedName}>多行文本</span>
              <span>包含6时</span>
              <span>显示</span>
              <span className={styles.componentsName}>日期时间</span>
            </div>
            <div className={styles.operation}>
              <Tooltip title="编辑">
                <span>
                  <Icon type="bianji" className={styles.edit} />
                </span>
              </Tooltip>
              <Tooltip title="删除">
                <span>
                  <Icon type="shanchu" className={styles.delete} />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className={styles.ruleItem}>
            <div className={styles.content}>
              <span>当</span>
              <span className={styles.filedName}>单行文本</span>
              <span>等于任意一个A、B时</span>
              <span>显示</span>
              <span className={styles.componentsName}>数字</span>
            </div>
            <div className={styles.operation}>
              <Tooltip title="编辑">
                <span>
                  <Icon type="bianji" className={styles.edit} />
                </span>
              </Tooltip>
              <Tooltip title="删除">
                <span>
                  <Icon type="shanchu" className={styles.delete} />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        <Button className={styles.add} size="large" icon={<Icon type="xinzeng" />} onClick={handleShowModal}>
          添加逻辑规则
        </Button>
      </div>
      {showModal && <FormAttrModal onClose={handleClose} onOk={handleOk} />}
    </div>
  );
};

export default memo(FormAttrEditor);
