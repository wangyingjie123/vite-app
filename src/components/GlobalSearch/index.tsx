import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { SearchModalProps } from './components/SearchModal';
import SearchModal from './components/SearchModal';

/**
 * @description: 全局搜索菜单组件
 */
function GlobalSearch() {
  const { t } = useTranslation();
  const modalRef = useRef<SearchModalProps>(null);

  /** 切换显示 */
  const toggle = () => {
    modalRef.current?.toggle();
  };

  return (
    <>
      <Tooltip title={t('public.search')}>
        <Icon className="flex items-center justify-center text-lg cursor-pointer" icon="uil-search" onClick={toggle} />
      </Tooltip>

      <SearchModal modalRef={modalRef} />
    </>
  );
}

export default GlobalSearch;
