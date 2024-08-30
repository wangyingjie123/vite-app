import { Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import avatarImg from '@/assets/images/avatar.png';
import { useStore } from '@/store';

const HeaderAvatar = observer(() => {
  const navigate = useNavigate();
  const { userInfo, logout } = useStore('User');
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
      onClick: () => logout(),
    },
  ];
  return (
    <div className="ai-header-avatar">
      <span>{userInfo?.name}</span>
      <Dropdown menu={{ items }} placement="bottom" arrow trigger={['click']}>
        <Avatar className="ai-header-avatar-img" src={userInfo?.avatarThumb ?? avatarImg} />
      </Dropdown>
    </div>
  );
});
export default HeaderAvatar;
