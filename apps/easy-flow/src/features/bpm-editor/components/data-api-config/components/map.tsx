import { memo, useContext, useMemo } from 'react';
import { Form, Input, Dropdown, Menu, DropDownProps } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import DataContext from '../context';
import styles from './index.module.scss';

interface FieldMapProps {
  name: (string | number)[];
}

function FieldMap(props: FieldMapProps) {
  const { name } = props;
  const { fields, getPopupContainer } = useContext(DataContext)!;
  const options = useMemo(() => {
    return fields.map((item) => {
      return {
        name: item.name,
        id: `\${${item.id}}`,
      };
    });
  }, [fields]);
  return (
    <Form.Item
      name={name}
      isListField
      style={{ paddingBottom: 12 }}
      rules={[
        {
          validator(_, val: string) {
            if (!val) {
              return Promise.reject(new Error('映射字段不能为空'));
            }

            return Promise.resolve();
          },
        },
      ]}
      trigger="onChange"
    >
      <AutoSelector options={options} getPopupContainer={getPopupContainer} />
    </Form.Item>
  );
}

export default memo(FieldMap);

interface AutoSelectorProps {
  value?: string;
  onChange?(value: this['value']): void;
  options: { id: string | number; name: string }[];
  getPopupContainer?: DropDownProps['getPopupContainer'];
}

export function AutoSelector(props: AutoSelectorProps) {
  const { options, value, onChange, getPopupContainer } = props;
  const showValue = useMemo(() => {
    return options.find((item) => item.id === value)?.name || value;
  }, [options, value]);

  const handleMenuClick = useMemoCallback(({ key }: { key: string }) => {
    onChange!(key);
  });

  const handleInputChange = useMemoCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange!(event.target.value);
  });

  return (
    <Dropdown
      getPopupContainer={(c) => c}
      overlay={
        <Menu className={styles.options} onClick={handleMenuClick}>
          {options.map((item) => {
            return (
              <Menu.Item key={item.id} className={item.id === value ? styles['field-selected'] : ''}>
                {item.name}
              </Menu.Item>
            );
          })}
        </Menu>
      }
      trigger={['click']}
    >
      <div className={styles.selector}>
        <Input size="large" value={showValue || value} onInput={handleInputChange} placeholder="请输入" />
      </div>
    </Dropdown>
  );
}
