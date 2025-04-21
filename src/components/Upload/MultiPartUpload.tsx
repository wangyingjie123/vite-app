import {
  ArrowUpOutlined,
  PauseOutlined,
  DeleteOutlined,
  FolderOpenTwoTone,
  RedoOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { message } from '@south/message';
import { Button, Flex, Progress, Typography } from 'antd';
import classnames from 'classnames';
import { useState, useRef, useEffect } from 'react';

import styles from './index.module.less';

import { useFileStore } from '@/stores/file';
import { BigFileUpload, formatSize } from '@/utils/big-file-upload';

type UploadStatus = 'nostart' | 'uploading' | 'done' | 'error' | 'cancel';

interface FileUploadProps {
  file: File;
  index: number;
}
const { Text } = Typography;
const App: React.FC<FileUploadProps> = ({ file, index }) => {
  const { deleteFile, setSuccessCount } = useFileStore();
  const [percent, setPercent] = useState(0);
  const [rateText, setRateText] = useState('');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('nostart');
  const fileUpload = useRef<BigFileUpload | null>(null);
  const startUpload = () => {
    setUploadStatus('uploading');
    fileUpload.current = new BigFileUpload({
      file: file as File,
      onChange: (event) => {
        if (event.status === 'success') {
          message.success({
            content: '文件上传成功',
            key: 'upload',
          });
          setSuccessCount();
          setUploadStatus('done');
        } else if (event.status === 'error') {
          message.error({
            content: '文件上传失败',
            key: 'upload',
          });
          setPercent(100);
          setUploadStatus('error');
        }
        const percent = Math.floor(event.progress * 100);
        setPercent(percent);
        if (event.speed) {
          setRateText(event.speed ?? '--');
        }
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
  const deleteFileItem = () => {
    fileUpload.current?.pauseUpload();
    setPercent(0);
    setUploadStatus('nostart');
    deleteFile(index);
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
  useEffect(() => {
    if (!file) {
      message.error({
        content: '未选择文件',
        key: 'upload',
      });
      return;
    }
    startUpload();
  }, [file]);
  return (
    <div className={classnames(styles.item, 'w-full')}>
      <Flex gap={10} align="center" justify="space-between">
        <Text className="text-12px" ellipsis>
          {file.name}
        </Text>
      </Flex>
      <Progress size={{ height: 3 }} percent={percent} className="mb-5px" status={progressStatus()} />
      <Flex align="center" className={styles.info}>
        <Text className="mr-auto" type="secondary">
          {formatSize(file.size)}
        </Text>
        {uploadStatus === 'nostart' && (
          <Button size="small" variant="text" color="primary" onClick={startUpload} icon={<ArrowUpOutlined />} />
        )}
        {uploadStatus === 'cancel' && (
          <Button size="small" variant="text" color="primary" onClick={resum} icon={<CaretRightOutlined />} />
        )}
        {uploadStatus === 'uploading' && (
          <>
            <Text type="success" className="mr-5px">
              {rateText}
            </Text>
            <Button variant="text" color="primary" size="small" onClick={pause} icon={<PauseOutlined />} />
          </>
        )}
        {uploadStatus === 'error' && (
          <Button variant="text" color="danger" size="small" onClick={resum} icon={<RedoOutlined />} />
        )}
        {uploadStatus === 'done' ? (
          <Button variant="text" color="green" size="small" icon={<FolderOpenTwoTone />} />
        ) : (
          <Button variant="text" color="danger" size="small" onClick={deleteFileItem} icon={<DeleteOutlined />} />
        )}
      </Flex>
    </div>
  );
};

export default App;
