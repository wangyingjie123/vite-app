import type { TFunction } from 'i18next';

import CustomizeInput from './components/customize-Input';

import type { FormList, SearchList } from '#/form';
import { FORM_REQUIRED } from '@/utils/config';

// 搜索数据
export const searchList = (t: TFunction): SearchList[] => [
  {
    label: t('file.fileName'),
    name: 'filename',
    component: 'Input',
  },
];

// 新增数据
export const createList = (t: TFunction): FormList[] => [
  {
    label: t('login.username'),
    name: 'username',
    rules: FORM_REQUIRED,
    extra: '这是描述，这是描述，这是描述。',
    component: 'Input',
    componentProps: {
      style: {
        width: '80%',
      },
    },
  },
  {
    label: t('content.nestedData'),
    name: ['user', 'name', 'test'],
    rules: FORM_REQUIRED,
    component: 'Input',
    unit: '单位',
    componentProps: {
      style: {
        width: '80%',
      },
    },
  },
  {
    label: t('public.title'),
    name: 'title',
    rules: FORM_REQUIRED,
    component: 'customize',
    render: CustomizeInput,
    componentProps: {
      style: {
        width: '80%',
      },
    },
  },
  {
    label: t('public.content'),
    name: 'content',
    component: 'RichEditor',
    componentProps: {
      style: {
        width: '80%',
      },
    },
  },
];
