import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Row, Col } from "antd";
import { getSceneImageUrl } from "@utils";
import { SCENE_IAMGES } from "@consts";
import Icon from "@components/icon";
import { SceneShape } from "../types";
import styles from "./index.module.scss";

interface SelectImageProps {
  value?: string;
  onChange?(value: string): void;
}

const SelectImage = React.memo(function SelectImage(props: SelectImageProps) {
  const { value, onChange } = props;

  return (
    <Row className={styles.images} gutter={13} wrap>
      {Object.keys(SCENE_IAMGES).map((key) => {
        const image = getSceneImageUrl(key as keyof typeof SCENE_IAMGES);

        return (
          <Col key={key} className={styles.col} span={6} onClick={onChange && (() => onChange(key))}>
            <div className={styles.box}>
              {value === key && (
                <div className={styles.mask}>
                  <Icon type="gou" />
                </div>
              )}
              <img src={image} alt="scene-cover" />
            </div>
          </Col>
        );
      })}
    </Row>
  );
});

export interface EditSceneProps {
  data?: SceneShape;
  visible: boolean;
  onSubmit(scene: SceneShape & Omit<SceneShape, "id">): Promise<void>;
  onCancel(): void;
}

function EditScene(props: EditSceneProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { data, visible, onSubmit, onCancel } = props;
  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      await onSubmit(Object.assign({}, data, await form.validateFields()));
    } finally {
      setLoading(false);
    }
  }, [onSubmit, form, data]);

  const nameRules = useMemo(() => {
    return [
      {
        validator(_: any, value: string) {
          if (!value || value.length > 50 || /[^\u4e00-\u9fa5_\d\w]/.test(value)) {
            return Promise.reject(new Error("应用名为1-50位汉字、字母、数字、下划线"));
          } else {
            return Promise.resolve();
          }
        },
        required: true,
      },
    ];
  }, []);

  const formatInputValue = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    return event.target.value.trim();
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (data) {
      form.setFieldsValue({
        name: data.name,
        icon: data.icon || SCENE_IAMGES.scene1,
        remark: data.remark,
      });
    } else {
      form.setFieldsValue({
        name: "",
        icon: SCENE_IAMGES.scene1,
        remark: "",
      });
    }
  }, [form, data, visible]);

  return (
    <Modal
      visible={visible}
      title={data ? "编辑应用" : "新增应用"}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={576}
      okText="确认"
      cancelText="取消"
      cancelButtonProps={{ type: "text", size: "large" }}
      okButtonProps={{ size: "large" }}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
    >
      <Form form={form} className={styles.form} layout="vertical" autoComplete="off">
        <div className={styles.column}>
          <Form.Item label="应用名称" name="name" rules={nameRules}>
            <Input placeholder="请填写应用名称" size="large" autoFocus />
          </Form.Item>
          <Form.Item label="应用描述" name="remark" getValueFromEvent={formatInputValue}>
            <Input.TextArea className={styles.textarea} size="large" placeholder="请填写应用描述" maxLength={200} />
          </Form.Item>
        </div>
        <div className={styles.column}>
          <Form.Item label="封面图片" name="icon" required>
            <SelectImage />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default React.memo(EditScene);
