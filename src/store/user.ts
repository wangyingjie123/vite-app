import { observable, makeObservable, runInAction } from 'mobx';
import { createContext } from 'react';

import { loginByFeishu } from '@/service/userinfo';
import type { UserInfo } from '@/types/user';
import { getCookie, delCookie } from '@/utils/cookie';

export class UserStore {
  token = getCookie('jwt') || '';
  userInfo: UserInfo | undefined;
  constructor() {
    makeObservable(this, {
      token: observable,
      userInfo: observable,
    });
  }

  getToken = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (!code) return;
      const res = await loginByFeishu(code);
      runInAction(() => {
        this.token = res;
      });
    } catch (error) {
      console.error(error);
    }
  };

  setUserInfo = (userinfo: UserInfo) => {
    runInAction(() => {
      this.userInfo = userinfo;
    });
  };

  logout = () => {
    runInAction(() => {
      this.token = '';
    });
    delCookie('jwt');
    // const logoutUrl = `https://open.feishu.cn/open-apis/authen/v1/index?app_id=cli_a3211cf3a9f8d00e&redirect_uri=${window.location.origin}`;
    // window.location.href = logoutUrl;
  };
}
export const userStore = new UserStore();
export const User = createContext(userStore);
