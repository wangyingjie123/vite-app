import { useContext } from 'react';

import { Layout, LayoutStore } from './layout';
import { User, UserStore } from './user';

type StoryNameType = 'Layout' | 'User';
// 重载useStore方法，保证每个Store返回的类型能正确识别
export function useStore(name: 'Layout'): LayoutStore;
export function useStore(name: 'User'): UserStore;
export function useStore(name: StoryNameType) {
  const storeMap = {
    Layout: useContext(Layout),
    User: useContext(User),
  };
  return storeMap[name];
}
