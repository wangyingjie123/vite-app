import type { SelectProps } from 'antd';

import { ApiSelect } from '@/components/Selects';
import { getPartner } from '@/servers/platform/partner';

/**
 * @description: 合作公司下拉组件
 */
function PartnerSelect(props: SelectProps) {
  return <ApiSelect {...props} api={getPartner} mode="multiple" fieldNames={{ label: 'name', value: 'id' }} />;
}

export default PartnerSelect;
