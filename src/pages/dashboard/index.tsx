import { useEffectOnActive } from 'keepalive-for-react';

import Bar from './components/Bar';
import Block from './components/Block';
import Line from './components/Line';

import BaseCard from '@/components/Card/BaseCard';
import BaseContent from '@/components/Content/BaseContent';
import { useCommonStore } from '@/hooks/useCommonStore';
import { checkPermission } from '@/utils/permissions';

function Dashboard() {
  const { permissions, isPhone } = useCommonStore();
  const isPermission = checkPermission('/dashboard', permissions);

  useEffectOnActive(() => {
    console.log('进入和退出时执行');

    return () => {
      console.log('退出时执行');
    };
  }, []);

  return (
    <BaseContent isPermission={isPermission}>
      <BaseCard>
        <div className="pt-10px">
          <Block />
        </div>

        <div className="flex flex-wrap justify-between w-full">
          <div className={`mb-10px ${isPhone ? 'w-full' : 'w-49.5%'}`}>
            <Line />
          </div>
          <div className={`mb-10px ${isPhone ? 'w-full' : 'w-49.5%'}`}>
            <Bar />
          </div>
        </div>
      </BaseCard>
    </BaseContent>
  );
}

export default Dashboard;
