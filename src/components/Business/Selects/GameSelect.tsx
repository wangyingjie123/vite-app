import type { TreeSelectProps } from 'antd';

import { ApiTreeSelect } from '@/components/Selects';
import { getGames } from '@/servers/platform/game';

/**
 * @description: 游戏下拉组件
 */
function GameSelect(props: TreeSelectProps) {
  return (
    <>
      <ApiTreeSelect {...props} multiple={true} api={getGames} fieldNames={{ label: 'name', value: 'id' }} />
    </>
  );
}

export default GameSelect;
