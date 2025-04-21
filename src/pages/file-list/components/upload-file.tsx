import { UploadOutlined, FolderAddOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Flex, Upload } from 'antd';

import { useFileStore } from '@/stores/file';

interface UploadBtnProps {
  createFolder: () => void;
}
function UploadBtn({ createFolder }: UploadBtnProps) {
  const { setFileList, fileList, setOpen } = useFileStore();

  const uploadProps: UploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: (_file, files) => {
      setFileList([...fileList, ...files]);
      setOpen(true);
      return false;
    },
  };

  return (
    <Flex gap={10} className="flex-1">
      <Upload {...uploadProps}>
        <Button type="primary" icon={<UploadOutlined />}>
          上传文件
        </Button>
      </Upload>
      <Button type="primary" ghost icon={<FolderAddOutlined />} onClick={createFolder}>
        新建文件夹
      </Button>
    </Flex>
  );
}

export default UploadBtn;
