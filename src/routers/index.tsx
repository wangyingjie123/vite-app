import { useRoutes, Navigate } from 'react-router-dom';
import NotDefined from '@/pages/404';
import userRouters from './modules/user';

import type { RouteObject } from '@/types/routers';

export const routers: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/user/list" />,
    hidden: true,
  },
  {
    path: '/404',
    element: <NotDefined />,
  },
  ...userRouters,
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
];

const Router = () => {
  const routes = useRoutes(routers);
  return routes;
};

export default Router;
