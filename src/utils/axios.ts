/**
 * @file axios 请求通用封装
 * @author kevinyjwang
 */
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { userStore } from '@/store/user';

export enum ResponseCode {
  TokenOut = 10002,
}

export interface CommonAPI<T = Record<string, unknown>> {
  data?: T;
  message: string;
  status: number;
  success: boolean;
}

const httpCodeMsg: { [key: number]: string } = {
  400: '请求参数错误',
  401: '登录状态已过期，请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时',
};

const getRequestUrl = (router: string | undefined) => {
  const host = '';
  if (!router) return '';
  if (/(http|https):\/\/([\w.]+\/?)\S*/.test(router)) {
    return router;
  }
  return host + router;
};
const axiosParams: AxiosRequestConfig = {
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  timeout: 5000,
};
const instance = axios.create(axiosParams);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { success, message, status } = response.data;
    if (status === ResponseCode.TokenOut) {
      userStore.logout();
      return Promise.reject(message);
    }
    return success ? Promise.resolve(response.data) : Promise.reject(message);
  },
  (error) => {
    const code = error?.response?.status;
    const msg = code ? httpCodeMsg[code] : '接口请求失败';
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes('timeout')) {
      return Promise.reject('请求超时');
    }
    // if (code === 401) {
    //   userStore.signOut();
    // }
    return Promise.reject(new Error(msg));
  }
);

/**
 * 发送 HTTP 请求（封装 axios）
 * @param {AxiosRequestConfig} config - 请求信息配置
 * @return {Promise<T>} HTTP 响应结果
 */
async function request<T>(config: AxiosRequestConfig & { disabledFeedback?: boolean }): Promise<T> {
  const params = {
    ...config,
    url: getRequestUrl(config.url),
  };
  const { data } = await instance.request<T>(params);
  return data;
}

export { request };
