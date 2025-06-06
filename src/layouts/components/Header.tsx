import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  FormOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { App, Dropdown } from 'antd';
import { useKeepAliveContext } from 'keepalive-for-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from '../index.module.less';

import Nav from './Nav';
import type { PasswordModal } from './UpdatePassword';
import UpdatePassword from './UpdatePassword';

import Avatar from '@/assets/images/avatar.png';
import Fullscreen from '@/components/Fullscreen';
import Theme from '@/components/Theme';
import UploadTransfer from '@/components/Upload/UploadTransfer';
// import GlobalSearch from '@/components/GlobalSearch';
// import I18n from '@/components/I18n';
import { useCommonStore } from '@/hooks/useCommonStore';
import { useToken } from '@/hooks/useToken';
import { useMenuStore, useTabsStore, useUserStore } from '@/stores';

type MenuKey = 'password' | 'logout';

function Header() {
  const [, , removeToken] = useToken();
  const { t } = useTranslation();
  const { destroy } = useKeepAliveContext();
  const { modal } = App.useApp();
  const { isCollapsed, isMaximize, username, nav } = useCommonStore();
  // 是否窗口最大化
  const passwordRef = useRef<PasswordModal>(null);
  const navigate = useNavigate();
  const toggleCollapsed = useMenuStore((state) => state.toggleCollapsed);
  const clearInfo = useUserStore((state) => state.clearInfo);
  const { closeAllTab, setActiveKey } = useTabsStore((state) => state);

  // 下拉菜单内容
  const items: MenuProps['items'] = [
    {
      key: 'password',
      label: <span>{t('public.changePassword')}</span>,
      icon: <FormOutlined className="mr-1" />,
    },
    {
      key: 'logout',
      label: <span>{t('public.signOut')}</span>,
      icon: <LogoutOutlined className="mr-1" />,
    },
  ];

  /** 点击菜单 */
  const onClick: MenuProps['onClick'] = (e) => {
    switch (e.key as MenuKey) {
      case 'password':
        passwordRef.current?.open();
        break;

      case 'logout':
        handleLogout();
        break;

      default:
        break;
    }
  };

  /** 退出登录 */
  const handleLogout = () => {
    modal.confirm({
      title: t('public.kindTips'),
      icon: <ExclamationCircleOutlined />,
      content: t('public.signOutMessage'),
      onOk() {
        clearInfo();
        closeAllTab();
        setActiveKey('');
        removeToken();
        destroy(); // 清除keepalive缓存
        navigate('/login');
      },
    });
  };

  /** 右侧组件抽离减少重复渲染 */
  const RightRender = () => {
    return (
      <div className="flex gap-20px items-center">
        <UploadTransfer />
        <Fullscreen />
        {/* <GlobalSearch /> */}
        {/* <I18n /> */}
        <Theme />
        <Dropdown className="min-w-50px" menu={{ items, onClick }}>
          <div className="ant-dropdown-link flex items-center cursor-pointer" onClick={(e) => e.preventDefault()}>
            <img
              src={Avatar}
              width={27}
              height={27}
              alt="Avatar"
              className="rounded-1/2 overflow-hidden object-cover bg-light-500"
            />
            <span className="ml-2 text-15px min-w-50px truncate">{username || 'south-admin'}</span>
          </div>
        </Dropdown>
      </div>
    );
  };

  /** icon渲染 */
  const IconRender = () => {
    return (
      <div className="text-lg cursor-pointer mr-15px" onClick={() => toggleCollapsed(!isCollapsed)}>
        {isCollapsed && <MenuUnfoldOutlined />}
        {!isCollapsed && <MenuFoldOutlined />}
      </div>
    );
  };

  return (
    <>
      <header
        className={`
          border-bottom
          flex
          items-center
          justify-between
          px-6
          py-6px
          box-border
          transition-all
          ${styles['header-driver']}
          ${isMaximize ? styles['hide'] : ''}
        `}
      >
        <div className="flex item-center">
          <IconRender />

          <Nav list={nav} />
        </div>

        <RightRender />
      </header>

      <UpdatePassword passwordRef={passwordRef} />
    </>
  );
}

export default Header;
