import { CheckOutlined, CloseOutlined, FolderFilled, FileFilled } from '@ant-design/icons';
import type { GetRef, InputRef } from 'antd';
import { Form, Input, Flex, Button, Typography } from 'antd';
import React, { useContext, useEffect, useRef } from 'react';

import type { FileData } from '#/file';
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} tabIndex={index} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  editing: boolean;
  dataIndex: keyof FileData;
  record: FileData;
  handleSave: (record: FileData, isSave: boolean) => void;
  pathSearch: (path: string) => void;
}

export const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  editing,
  children,
  dataIndex,
  record,
  handleSave,
  pathSearch,
  ...restProps
}) => {
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, [editing]);

  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values }, true);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const cancel = () => {
    handleSave(record, false);
  };

  const handleSearch = () => {
    if (record.type === 'folder') {
      pathSearch(record.filename);
    }
  };
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Flex gap={8}>
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          className="flex-1"
          rules={[{ required: true, message: `${title}不能为空` }]}
        >
          <Input ref={inputRef} onPressEnter={save} placeholder="请输入文件名" />
        </Form.Item>
        <Form.Item style={{ margin: 0 }}>
          <Button icon={<CheckOutlined />} className="mr-8px" onClick={save} />
          <Button icon={<CloseOutlined />} onClick={cancel} />
        </Form.Item>
      </Flex>
    ) : (
      <Flex className="editable-cell-value-wrap" align="center">
        {record.type === 'folder' && <Button icon={<FolderFilled />} className="min-w-32px" type="link" />}
        {record.type === 'file' && <Button icon={<FileFilled />} className="min-w-32px" type="link" />}
        <Typography.Text className="cursor-pointer hover:text-[#1677ff]" ellipsis onClick={handleSearch}>
          {children}
        </Typography.Text>
      </Flex>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
