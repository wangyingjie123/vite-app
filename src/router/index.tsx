import StaticMessage from '@south/message';
import { App, theme, ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import nprogress from 'nprogress';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HashRouter as Router } from 'react-router-dom';

import RouterPage from './components/Router';

// antd

import { useCommonStore } from '@/hooks/useCommonStore';

// 禁止进度条添加loading
nprogress.configure({ showSpinner: false });

// antd主题
const { defaultAlgorithm, darkAlgorithm } = theme;

export default function Page() {
  const { i18n } = useTranslation();
  const { theme } = useCommonStore();
  // 获取当前语言
  const currentLanguage = i18n.language;

  useEffect(() => {
    // 关闭loading
    const firstElement = document.getElementById('first');
    if (firstElement && firstElement.style?.display !== 'none') {
      firstElement.style.display = 'none';
    }
  }, []);

  return (
    <Router>
      <ConfigProvider
        locale={currentLanguage === 'en' ? enUS : zhCN}
        theme={{
          algorithm: [theme === 'dark' ? darkAlgorithm : defaultAlgorithm],
        }}
      >
        <App className="w-full h-full">
          <StaticMessage />
          <RouterPage />
        </App>
      </ConfigProvider>
    </Router>
  );
}
