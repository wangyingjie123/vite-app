import { request } from '@/utils/axios';
import type { UserInfo } from '@/types/user';

export function getUserInfo(): Promise<UserInfo> {
  return request({
    url: '/api/user/profile',
    method: 'post',
  });
}

/**飞书授权登录 */
export function loginByFeishu(code: string): Promise<string> {
  return request({
    url: '/api/auth/feishu/auth2',
    method: 'get',
    params: {
      code,
    },
  });
}
/**
 * 解析token信息
 */
export function getTokenInfo(): Promise<string> {
  return request({
    url: '/api/auth/token/info',
    method: 'get',
  });
}

/**
 * 获取用户列表
 */
interface GetUserListParams {
  currentPage: number;
  pageSize: number;
}
interface GetUserListRes {
  meta: {
    pageSize: number;
    totalCounts: number;
    totalPages: number;
    currentPage: number;
  };
  items: UserInfo[];
}
export function getUserInfoList(data: GetUserListParams): Promise<GetUserListRes> {
  return request({
    url: '/api/user/list/pagination',
    method: 'post',
    data,
  });
}

export function serviceLogout(): Promise<null> {
  return request({
    url: '/api/auth/logout',
    method: 'post',
  });
}
