import { Icon } from '@iconify/react';
import { Skeleton, message } from 'antd';
import { KeepAlive, useKeepAliveRef } from 'keepalive-for-react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Menu from './components/Menu';
import Tabs from './components/Tabs';
import styles from './index.module.less';
import { versionCheck } from './utils/helper';

import { useCommonStore } from '@/hooks/useCommonStore';
import { useToken } from '@/hooks/useToken';
import Forbidden from '@/pages/403';
import { getPermissions } from '@/servers/permissions';
import { getMenuList } from '@/servers/system/menu';
import { useMenuStore, useUserStore } from '@/stores';

function Layout() {
  const [getToken] = useToken();
  const { pathname, search } = useLocation();
  const token = getToken();
  const outlet = useOutlet();
  const aliveRef = useKeepAliveRef();
  const [isLoading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { setPermissions, setUserInfo } = useUserStore((state) => state);
  const { setMenuList, toggleCollapsed, togglePhone } = useMenuStore((state) => state);

  const { permissions, userId, isMaximize, isCollapsed, isPhone, isRefresh } = useCommonStore();

  /** 获取用户信息和权限 */
  const getUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { code, data } = await getPermissions({ refresh_cache: false });
      if (Number(code) !== 200) return;
      const { user, permissions } = data;
      setUserInfo(user);
      setPermissions(permissions);
    } catch (err) {
      console.error('获取用户数据失败:', err);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 获取菜单数据 */
  const getMenuData = useCallback(async () => {
    try {
      setLoading(true);
      const { code, data } = await getMenuList();
      if (Number(code) !== 200) return;
      setMenuList(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 当用户信息缓存不存在时则重新获取
    if (token && !userId) {
      getUserInfo();
      getMenuData();
    }
  }, [getUserInfo, getMenuData, token, userId]);

  // 监测是否需要刷新
  useEffect(() => {
    versionCheck(messageApi);
  }, [pathname]);

  /** 判断是否是手机端 */
  const handleIsPhone = debounce(() => {
    const isPhone = window.innerWidth <= 768;
    // 手机首次进来收缩菜单
    if (isPhone) toggleCollapsed(true);
    togglePhone(isPhone);
  }, 500);

  // 监听是否是手机端
  useEffect(() => {
    handleIsPhone();
    window.addEventListener('resize', handleIsPhone);

    return () => {
      window.removeEventListener('resize', handleIsPhone);
    };
  }, []);

  /**
   * 用于区分不同页面以进行缓存
   */
  const cacheKey = useMemo(() => {
    return pathname + search;
  }, [pathname, search]);

  return (
    <div id="layout">
      {contextHolder}
      <Menu />
      <div className={styles.layout_right}>
        <div
          id="header"
          className={`
            border-bottom
            transition-all
            ${styles.header}
            ${isCollapsed ? styles['header-close-menu'] : ''}
            ${isMaximize ? styles['header-none'] : ''}
            ${isPhone ? `!left-0 z-999` : ''}
          `}
        >
          <Header />
          <Tabs />
        </div>
        <div
          id="layout-content"
          className={`
            overflow-auto
            transition-all
            ${styles.con}
            ${isMaximize ? styles['con-maximize'] : ''}
            ${isCollapsed ? styles['con-close-menu'] : ''}
            ${isPhone ? `!left-0 !w-full` : ''}
          `}
        >
          {isLoading && permissions.length === 0 && <Skeleton active className="p-30px" paragraph={{ rows: 10 }} />}
          {!isLoading && permissions.length === 0 && <Forbidden />}
          {isRefresh && (
            <div
              className={`
              absolute
              left-50%
              top-50%
              -rotate-x-50%
              -rotate-y-50%
            `}
            >
              <Icon className="text-40px animate-spin" icon="ri:loader-2-fill" />
            </div>
          )}
          {permissions.length > 0 && !isRefresh && (
            <KeepAlive transition max={20} aliveRef={aliveRef} activeCacheKey={cacheKey}>
              {outlet}
            </KeepAlive>
          )}
        </div>
      </div>
    </div>
  );
}

export default Layout;
