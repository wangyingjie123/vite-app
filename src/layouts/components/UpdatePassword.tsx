import { Form, message } from 'antd';
import type { FormProps } from 'antd/es/form/Form';
import { Ref, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BaseModal from '@/components/Modal/BaseModal';
import PasswordStrength from '@/components/PasswordStrength';
import { updatePassword } from '@/servers/login';
import { PASSWORD_RULE } from '@/utils/config';

export interface PasswordModal {
  open: () => void;
}

interface Props {
  passwordRef: Ref<PasswordModal>;
}

function UpdatePassword(props: Props) {
  const { passwordRef } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // 抛出外部方法
  useImperativeHandle(passwordRef, () => ({
    open: () => {
      setOpen(true);
    },
  }));

  /** 点击模态框确定 */
  const onOk = () => {
    form?.submit();
  };

  /** 关闭模态框 */
  const onClose = () => {
    setOpen(false);
    form?.resetFields();
  };

  /**
   * 提交表单
   * @param values - 表单值
   */
  const onFinish: FormProps['onFinish'] = async (values) => {
    // 当密码和确认密码不同时则提示错误
    if (values.newPassword !== values.confirmPassword) {
      return messageApi.warning({
        content: t('login.confirmPasswordMessage'),
        key: 'confirmPassword',
      });
    }
    try {
      setLoading(true);
      const { code, message } = await updatePassword(values);
      if (Number(code) === 200) {
        onClose();
        messageApi.success(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <BaseModal
        title={t('public.changePassword')}
        open={isOpen}
        confirmLoading={isLoading}
        onOk={onOk}
        onCancel={() => onClose()}
      >
        <Form
          name="UpdatePassword"
          form={form}
          labelWrap
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={t('login.oldPassword')}
            name="oldPassword"
            rules={[
              { required: true, message: t('public.pleaseEnter', { name: t('login.password') }) },
              PASSWORD_RULE(t),
            ]}
          >
            <PasswordStrength />
          </Form.Item>
          <Form.Item
            label={t('login.newPassword')}
            name="newPassword"
            rules={[
              { required: true, message: t('public.pleaseEnter', { name: t('login.password') }) },
              PASSWORD_RULE(t),
            ]}
          >
            <PasswordStrength />
          </Form.Item>

          <Form.Item
            label={t('login.confirmPassword')}
            name="confirmPassword"
            rules={[
              { required: true, message: t('public.pleaseEnter', { name: t('login.confirmPassword') }) },
              PASSWORD_RULE(t),
            ]}
          >
            <PasswordStrength />
          </Form.Item>
        </Form>
      </BaseModal>
    </>
  );
}

export default UpdatePassword;
