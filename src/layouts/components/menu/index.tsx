import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

import { getOpenKeys } from '@/utils/handle-routes';
import { useStore } from '@/store';
import Logo from './logo';
import { routers } from '@/routers';

import type { MenuProps } from 'antd';
import type { RouteObject } from '@/types/routers';
import './index.less';

// 定义 menu 类型
type MenuItem = Required<MenuProps>['items'][number];
const getItem = (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const LayoutMenu = () => {
  const { collapsed } = useStore('Layout');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 处理routes数据为 antd 菜单需要的 key 值
  const deepLoopFloat = (menuList: RouteObject[], newArr: MenuItem[] = []) => {
    menuList.forEach((item: RouteObject) => {
      if (item.hidden || !item.title) return;
      if (!item?.children?.length) return newArr.push(getItem(item.title, item.path, item.icon));
      newArr.push(getItem(item.title, item.path, item.icon, deepLoopFloat(item.children)));
    });
    return newArr;
  };
  // 设置当前展开的 subMenu
  const onOpenChange = (openKeys: string[]) => {
    if (openKeys.length === 0 || openKeys.length === 1) return setOpenKeys(openKeys);
    const latestOpenKey = openKeys[openKeys.length - 1];
    if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
    setOpenKeys([latestOpenKey]);
  };
  // 点击当前菜单跳转页面
  const clickMenu = ({ key }: { key: string }) => {
    navigate(key);
  };
  useEffect(() => {
    const list = deepLoopFloat(routers);
    setMenuList(list);
  }, []);

  // 刷新页面菜单保持高亮
  useEffect(() => {
    setSelectedKeys([pathname]);
    const selectPath = getOpenKeys(pathname);
    if (collapsed) {
      setOpenKeys(selectPath);
    }
  }, [pathname, collapsed]);
  return (
    <div className="menu">
      <Logo isCollapse={collapsed}></Logo>
      <Menu
        theme="light"
        mode="inline"
        triggerSubMenuAction="click"
        onClick={clickMenu}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        items={menuList}
        className="noscrollbar"
        onOpenChange={onOpenChange}
      ></Menu>
    </div>
  );
};

export default observer(LayoutMenu);
