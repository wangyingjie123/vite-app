import { Dropdown, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import type { MenuProps } from 'antd';
import avatarImg from '@/assets/images/avatar.png';

const HeaderAvatar = observer(() => {
  const navigate = useNavigate();
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <span className="dropdown-item">首页</span>,
      onClick: () => navigate('/'),
    },
    {
      key: '2',
      label: <span className="dropdown-item">修改密码</span>,
      onClick: () => navigate('/global/update-password'),
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: <span className="dropdown-item">退出登录</span>,
      // onClick: () => signOut(),
    },
  ];
  return (
    <div className="ai-header-avatar">
      <span>kevin durant</span>
      <Dropdown menu={{ items }} placement="bottom" arrow trigger={['click']}>
        <Avatar className="ai-header-avatar-img" src={avatarImg} />
      </Dropdown>
    </div>
  );
});
export default HeaderAvatar;
