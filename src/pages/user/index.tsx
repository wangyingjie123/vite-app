import { useState, useEffect } from 'react';
import { Table, App } from 'antd';
import getColumns from './column';
import PageCard from '@/components/page-card';
import { getUserInfoList } from '@/service/userinfo';
import type { UserInfo } from '@/types/user';

function User() {
  const { message } = App.useApp();
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState<UserInfo[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const getTableData = async () => {
    try {
      const { meta, items } = await getUserInfoList({
        currentPage: page,
        pageSize: size,
      });
      setTotal(meta.totalCounts);
      setDataSource(items);
    } catch (err) {
      message.error({
        content: `${err}`,
        key: 'home',
      });
    }
  };

  useEffect(() => {
    getTableData();
  }, [page, size]);
  return (
    <PageCard title="用户管理">
      <Table
        rowKey="id"
        columns={getColumns(page, size)}
        dataSource={dataSource}
        pagination={{
          hideOnSinglePage: true,
          total,
          current: 1,
          onChange: (page, size) => {
            setPage(page);
            setSize(size);
          },
        }}
      />
    </PageCard>
  );
}
export default User;
