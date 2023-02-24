import { ConfigProvider, App } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';
import { HashRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import '@/assets/styles/global.less';
import Router from '@/routers/index';

dayjs.locale('zh-cn');

function ReactApp() {
  return (
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <App className="app-container">
          <Router />
        </App>
      </ConfigProvider>
    </HashRouter>
  );
}

export default observer(ReactApp);
