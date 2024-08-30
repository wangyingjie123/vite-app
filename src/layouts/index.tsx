import { Layout, App } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './components/footer';
import Header from './components/header';
import LayoutMenu from './components/menu';

import { getUserInfo } from '@/service/userinfo';
import { useStore } from '@/store';
import './index.less';

const { Content, Sider } = Layout;

/** 侧边栏布局：左侧菜单栏，右侧页面内容 */
function SiderLayout() {
  const { collapsed, setCollapsed } = useStore('Layout');
  const { setUserInfo, token, getToken } = useStore('User');
  const { message } = App.useApp();
  const getUser = async () => {
    try {
      if (!token) {
        await getToken();
      }
      const res = await getUserInfo();
      setUserInfo(res);
    } catch (err) {
      message.error({
        content: `${err}`,
        key: 'home',
      });
    }
  };
  useEffect(() => {
    getUser();
  }, [token]);
  return (
    <Layout className="container">
      <Sider
        collapsible
        trigger={null}
        theme="dark"
        width={240}
        breakpoint="xl"
        collapsed={collapsed}
        onCollapse={(flag) => setCollapsed(flag)}
      >
        <LayoutMenu />
      </Sider>
      <Layout>
        <Header />
        <Content className="container-main noscrollbar">
          <Outlet />
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
}

export default observer(SiderLayout);
