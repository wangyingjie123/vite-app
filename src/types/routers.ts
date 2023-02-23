export interface MetaProps {
  keepAlive?: boolean;
  requiresAuth?: boolean;
  title: string;
  key?: string;
}

export interface RouteObject {
  title?: string;
  children?: RouteObject[];
  element?: React.ReactNode;
  path: string;
  icon?: React.ReactNode;
  hidden?: boolean;
  isLink?: boolean;
}
