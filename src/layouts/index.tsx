import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Layout } from 'antd';
import Header from './components/header';
import Footer from './components/footer';
import LayoutMenu from './components/menu';
import { useStore } from '@/store';
import './index.less';

const { Content, Sider } = Layout;

/** 侧边栏布局：左侧菜单栏，右侧页面内容 */
function SiderLayout() {
  const { collapsed, setCollapsed } = useStore('Layout');

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
      <Layout className="content-wrapper">
        <Header />
        <Content className="content noscrollbar">
          <Outlet />
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
}

export default observer(SiderLayout);
