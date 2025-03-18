import { useEffectOnActive } from 'keepalive-for-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Block from './components/Block';
import { searchList } from './model';

import type { FormData } from '#/form';
import BaseCard from '@/components/Card/BaseCard';
import BaseContent from '@/components/Content/BaseContent';
import BaseSearch from '@/components/Search/BaseSearch';
import { useCommonStore } from '@/hooks/useCommonStore';
import { getDataTrends } from '@/servers/dashboard';
import { checkPermission } from '@/utils/permissions';

// 初始化搜索
const initSearch = {
  pay_date: ['2025-03-10', '2025-03-18'],
};

function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const { permissions, isPhone } = useCommonStore();
  const isPermission = checkPermission('/dashboard', permissions);

  /**
   * 搜索提交
   * @param values - 表单返回数据
   */
  const handleSearch = useCallback(async (values: FormData) => {
    // 数据转换
    values.all_pay = values.all_pay ? 1 : undefined;

    const query = { ...values };
    try {
      setLoading(true);
      await getDataTrends(query);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(initSearch);
  }, [handleSearch]);

  useEffectOnActive(() => {
    console.log('进入和退出时执行');

    return () => {
      console.log('退出时执行');
    };
  }, []);

  useEffectOnActive(() => {
    console.log('第二次进入和退出时执行');

    return () => {
      console.log('第二次退出时执行');
    };
  }, []);

  return (
    <BaseContent isPermission={isPermission}>
      <BaseCard>
        <BaseSearch
          list={searchList(t)}
          data={initSearch}
          initSearch={initSearch}
          isLoading={isLoading}
          handleFinish={handleSearch}
        />
      </BaseCard>

      <BaseCard className="mt-10px">
        <div className="pt-10px">
          <Block />
        </div>

        <div className="flex flex-wrap justify-between w-full">
          <div className={`mb-10px ${isPhone ? 'w-full' : 'w-49.5%'}`}></div>
          <div className={`mb-10px ${isPhone ? 'w-full' : 'w-49.5%'}`}></div>
        </div>
      </BaseCard>
    </BaseContent>
  );
}

export default Dashboard;
