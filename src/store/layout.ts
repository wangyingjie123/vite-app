import { createContext } from 'react';
import { observable, action, makeObservable, runInAction } from 'mobx';

type Themes = 'light' | 'dark';

export class LayoutStore {
  collapsed = false;

  theme: Themes = 'light';

  constructor() {
    makeObservable(this, {
      collapsed: observable,
      theme: observable,
      setCollapsed: action,
      setTheme: action,
    });
  }

  setCollapsed = (isCollaPsed: boolean) => {
    runInAction(() => {
      this.collapsed = isCollaPsed;
    });
  };

  setTheme = () => {
    const changeTmeme = this.theme === 'dark' ? 'light' : 'dark';
    this.theme = changeTmeme;
    localStorage.setItem('rdeliveryTheme', changeTmeme);
  };
}
export const layoutStore = new LayoutStore();
export const Layout = createContext(layoutStore);
