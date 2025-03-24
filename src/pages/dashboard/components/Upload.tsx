import { UploadOutlined, FileOutlined, PauseOutlined, DeleteOutlined, CaretRightOutlined } from '@ant-design/icons';
import { message } from '@south/message';
import type { UploadProps } from 'antd';
import { Button, Upload, Flex, Progress } from 'antd';
import { useState, useRef } from 'react';

import { BigFileUpload } from '@/utils/big-file-upload';

type UploadStatus = 'nostart' | 'uploading' | 'done' | 'error' | 'cancel';
const App: React.FC = () => {
  const [fileList, setFileList] = useState<File | null>(null);
  const [percent, setPercent] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('nostart');
  const fileUpload = useRef<BigFileUpload | null>(null);
  const upload = () => {
    if (!fileList) {
      message.error('请先选择文件');
      return;
    }
    setUploadStatus('uploading');
    console.time('upload');
    fileUpload.current = new BigFileUpload({
      file: fileList as File,
      onChange: (event) => {
        if (event.status === 'success') {
          message.success('文件上传成功');
          setUploadStatus('done');
          console.timeEnd('upload');
        } else if (event.status === 'error') {
          message.error('文件上传失败');
          setPercent(100);
          setUploadStatus('error');
        }
        const percent = Math.floor(event.progress * 100);
        setPercent(percent);
      },
    });
  };
  const pause = () => {
    fileUpload.current?.pauseUpload();
    setUploadStatus('cancel');
  };
  const resum = () => {
    fileUpload.current?.resumeUpload();
    setUploadStatus('uploading');
  };
  const deleteFile = () => {
    fileUpload.current?.pauseUpload();
    setFileList(null);
    setPercent(0);
    setUploadStatus('nostart');
  };
  const progressStatus = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'active';
      case 'cancel':
        return 'active';
      case 'done':
        return 'success';
      case 'error':
        return 'exception';
      case 'nostart':
        return 'normal';
      default:
        return;
    }
  };
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      setPercent(0);
      setUploadStatus('nostart');
      setFileList(file);
      return false;
    },
  };
  return (
    <Flex vertical gap={15}>
      <Flex gap={10}>
        <Upload {...uploadProps}>
          <Button icon={<FileOutlined />}>选择文件</Button>
        </Upload>
      </Flex>
      {fileList && (
        <div>
          <Flex gap={10} align="center">
            <div className="mr-auto">{fileList?.name}</div>
            {uploadStatus === 'nostart' && (
              <Button onClick={upload} icon={<UploadOutlined />}>
                上传
              </Button>
            )}
            {uploadStatus === 'cancel' && (
              <Button type="primary" onClick={resum} icon={<CaretRightOutlined />}>
                继续
              </Button>
            )}
            {uploadStatus === 'uploading' && (
              <Button type="primary" onClick={pause} icon={<PauseOutlined />}>
                暂停
              </Button>
            )}
            <Button danger onClick={deleteFile} icon={<DeleteOutlined />}>
              删除
            </Button>
          </Flex>
          <Progress percent={percent} status={progressStatus()} />
        </div>
      )}
    </Flex>
  );
};

export default App;
