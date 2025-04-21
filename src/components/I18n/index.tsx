import { Icon } from '@iconify/react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LANG } from '@/utils/config';

export type Langs = 'zh' | 'en';

function I18n() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = localStorage.getItem(LANG);
    // 获取当前语言
    const currentLanguage = i18n.language;

    if (!lang) {
      localStorage.setItem(LANG, 'zh');
      i18n.changeLanguage('zh');
    } else if (currentLanguage !== lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  // 下拉菜单内容
  const items: MenuProps['items'] = [
    {
      key: 'zh',
      label: <span>中文</span>,
    },
    {
      key: 'en',
      label: <span>English</span>,
    },
  ];

  /** 点击菜单更换语言 */
  const onClick: MenuProps['onClick'] = (e) => {
    i18n.changeLanguage(e.key as Langs);
    localStorage.setItem(LANG, e.key);
  };

  return (
    <Dropdown placement="bottom" trigger={['click']} menu={{ items, onClick }}>
      <div className="ant-dropdown-link flex items-center cursor-pointer" onClick={(e) => e.preventDefault()}>
        <Icon className="flex items-center justify-center text-lg cursor-pointer" icon="cil:language" />
      </div>
    </Dropdown>
  );
}

export default I18n;
