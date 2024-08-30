import type { ColumnsType } from 'antd/es/table';

import type { UserInfo } from '@/types/user';

const getColumns = (page: number, size: number): ColumnsType<UserInfo> => [
  {
    title: '序号',
    dataIndex: 'sid',
    width: 80,
    render: (_val, _row, num) => (page - 1) * size + num + 1,
  },
  {
    title: '用户名',
    dataIndex: 'name',
  },
  {
    title: '中文名',
    dataIndex: 'enName',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: 'feishuUserId',
    dataIndex: 'feishuUserId',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
];
export default getColumns;
