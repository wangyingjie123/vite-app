import { Icon } from '@iconify/react';
import { Switch, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { type ThemeType, usePublicStore } from '@/stores/public';
import { THEME_KEY } from '@/utils/config';

function Theme() {
  const { t } = useTranslation();
  const themeCache = (localStorage.getItem(THEME_KEY) || 'light') as ThemeType;
  const setThemeValue = usePublicStore((state) => state.setThemeValue);
  const theme = usePublicStore((state) => state.theme);

  /**
   * 监听系统主题变化
   */
  useEffect(() => {
    if (!themeCache) {
      localStorage.setItem(THEME_KEY, 'light');
    }
    if (themeCache === 'dark') {
      document.body.className = 'theme-dark';
      setThemeValue('dark');
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      onThemeChange(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  /**
   * 处理更新
   */
  const onThemeChange = (checked: boolean) => {
    let type: ThemeType = 'light';
    if (checked) {
      document.body.className = 'theme-dark';
      type = 'dark';
    } else {
      document.body.className = 'theme-primary';
      type = 'light';
    }
    localStorage.setItem(THEME_KEY, type);
    setThemeValue(type);
  };

  return (
    <Tooltip title={t('public.themes', { name: theme === 'dark' ? '深色' : '浅色' })}>
      <Switch
        checkedChildren={<Icon icon="mdi-moon-waning-crescent" />}
        unCheckedChildren={<Icon icon="mdi-white-balance-sunny" />}
        onChange={onThemeChange}
        checked={theme === 'dark'}
      />
    </Tooltip>
  );
}

export default Theme;
