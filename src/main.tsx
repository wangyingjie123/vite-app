// 样式
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'; // 兼容低版本浏览器
// 时间设为中文
import dayjs from 'dayjs';
import ReactDOM from 'react-dom/client';

import Router from './router';
import '@/assets/css/public.less';
import '@/assets/fonts/font.less';

import 'uno.css';
import 'nprogress/nprogress.css';
import '@/assets/css/scrollbar.less';
import '@/assets/css/theme-color.less';

// 国际化i18n
import './locales/config';

// antd
import '@ant-design/v5-patch-for-react-19';
import '@/assets/css/antd.less';

import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
    <Router />
  </StyleProvider>
);

// 关闭loading
const firstElement = document.getElementById('first');
if (firstElement && firstElement.style?.display !== 'none') {
  firstElement.style.display = 'none';
}
