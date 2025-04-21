import { Icon } from '@iconify/react';
import { Popover, List } from 'antd';
import { useTranslation } from 'react-i18next';

import MultiPartUpload from './MultiPartUpload';

import { useFileStore } from '@/stores/file';

/**
 * @description: 全局搜索菜单组件
 */
function GlobalSearch() {
  const { t } = useTranslation();
  const { fileList, open, successCount, setOpen } = useFileStore();
  const content = () => (
    <List
      className="w-440px max-h-350px overflow-y-auto"
      style={{ marginRight: '-12px' }}
      size="small"
      dataSource={fileList}
      renderItem={(file, index) => (
        <List.Item style={{ paddingLeft: 0 }}>
          <MultiPartUpload file={file} index={index} />
        </List.Item>
      )}
    />
  );
  return (
    <Popover
      content={content}
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      title={`${t('file.transferList')} (${successCount}/${fileList.length})`}
      arrow={{ pointAtCenter: true }}
      placement="bottomRight"
    >
      <Icon className="flex items-center justify-center text-lg cursor-pointer" icon="mingcute-transfer-2-fill" />
    </Popover>
  );
}

export default GlobalSearch;
