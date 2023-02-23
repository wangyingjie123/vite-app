import { useContext } from 'react';
import { Layout, LayoutStore } from './layout';

type StoryNameType = 'Layout';
// 重载useStore方法，保证每个Store返回的类型能正确识别
export function useStore(name: 'Layout'): LayoutStore;
export function useStore(name: StoryNameType) {
  const storeMap = {
    Layout: useContext(Layout),
    // Env: useContext(Env),
  };
  return storeMap[name];
}
