import { useParams } from 'react-router-dom';

import BaseCard from '@/components/Card/BaseCard';
import BaseContent from '@/components/Content/BaseContent';
import { useCommonStore } from '@/hooks/useCommonStore';
import { checkPermission } from '@/utils/permissions';

function Dynamic() {
  const { id } = useParams();
  const { permissions } = useCommonStore();
  const isPermission = checkPermission('/demo/dynamic', permissions);

  return (
    <BaseContent isPermission={isPermission}>
      <BaseCard className="mt-10px mx-5px">
        <div>
          /demo/{id}/dynamic中的<span className="font-bold">{id}</span>
          为动态参数，可自由修改，文件路径为：/demo/[id]/dynamic。
        </div>
      </BaseCard>
    </BaseContent>
  );
}
export default Dynamic;
