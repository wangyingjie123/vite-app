import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { observer } from 'mobx-react-lite';

import Avatar from './avatar';

import { useStore } from '@/store';
import './index.less';

const { Header } = Layout;
const PageHeader = observer(() => {
  const { collapsed, setCollapsed } = useStore('Layout');

  return (
    <Header className="ai-header">
      <div className="ai-header-collapse" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
      <Avatar />
    </Header>
  );
});
export default PageHeader;
