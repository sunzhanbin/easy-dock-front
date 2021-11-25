import React, { memo, useEffect, useState } from 'react';
import { Select, Form } from 'antd';
import { FormInstance } from 'antd/es';
import { getFilesType } from '@apis/form';
import styles from '../comp-attr-editor/index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';

const { Option } = Select;

interface FilesProps {
  componentId: string;
}

type FileListType = {
  name: string;
  code: string;
  suffixes: string[];
};

const FilesType = (props: FilesProps) => {
  const [typeList, setTypeList] = useState<FileListType[]>([]);

  const getFilesTypeList = useMemoCallback(async () => {
    try {
      const ret = await getFilesType();
      setTypeList(ret.data);
      return
    } catch (e) {
      console.log(e);
    }
  });
  useEffect(() => {
    (
      async () => {
        await getFilesTypeList()
      }
    )()
  }, [getFilesTypeList]);
  return (
    <Form.Item noStyle shouldUpdate>
      {(form: FormInstance<any>) => {
        const formValue = form.getFieldValue('typeRestrict');
        if (!formValue || !formValue.enable) {
          return null;
        }

        return (
          <div className={styles.fileWrapper}>
            <Form.Item name={['typeRestrict', 'types']} rules={[
              {
                validator(_, value) {
                  if (!value.length) {
                    return Promise.reject(new Error('请选择文件类型!'));
                  }
                  return Promise.resolve();
                },
              },
            ]}>
              <Select
                mode="multiple"
                size="large"
                getPopupContainer={(node) => node}
                optionLabelProp="label"
                placeholder="请选择"
              >
                <>
                  {typeList?.map((item) => (
                    <Option key={item.code} value={item.code} label={item.name}>
                      <span className={styles.name}>{item.name}</span>
                      <span className={styles.suffixes}>{item.suffixes?.join(',')}</span>
                    </Option>
                  ))}
                  <Option value="custom" label="自定义">
                    自定义
                  </Option>
                </>
              </Select>
            </Form.Item>
            {formValue?.types?.includes('custom') && (
              <div className={styles.custom}>
                <p className={styles.customType}>自定义类型</p>
                <Form.Item name={['typeRestrict', 'custom']} rules={[
                  {
                    validator(_, value) {
                      if (!value.length) {
                        return Promise.reject(new Error('请选择自定义文件类型!'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}>
                  <Select mode="tags" tokenSeparators={[',']} size="large" placeholder="如 pdf，回车确定选择" />
                </Form.Item>
              </div>
            )}
          </div>
        );
      }}
    </Form.Item>
  );
};

export default memo(FilesType, (prev, next) => prev.componentId === next.componentId);
