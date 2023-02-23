import React from 'react';
import { CustomerServiceOutlined, FileSyncOutlined } from '@ant-design/icons';
import lazyLoad from '@/routers/utils/lazyLoad';
import { LayoutIndex } from '@/routers/constant';
import type { RouteObject } from '@/types/routers';

// 常用组件模块
const assemblyRouter: Array<RouteObject> = [
  {
    element: <LayoutIndex />,
    title: '用户管理',
    path: '/user',
    icon: <CustomerServiceOutlined />,
    children: [
      {
        path: '/user/list',
        element: lazyLoad(React.lazy(() => import('@/pages/user'))),
        title: '知识库维护',
        icon: <FileSyncOutlined />,
      },
    ],
  },
];
export default assemblyRouter;
