import type { EChartsCoreOption } from 'echarts';
import { useTranslation } from 'react-i18next';

import { useEcharts } from '@/hooks/useEcharts';

function Line() {
  const { t } = useTranslation();

  const option: EChartsCoreOption = {
    title: {
      text: '当日有效上传',
      left: 30,
      top: 5,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['07-11', '07-12', '07-13', '07-14', '07-15', '07-16', '07-17'],
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    series: [
      {
        name: t('dashboard.fileNumber'),
        type: 'line',
        areaStyle: {
          color: '#1890ff',
          opacity: 0.2,
        },
        emphasis: {
          focus: 'series',
        },
        data: [120, 140, 120, 190, 150, 111, 160],
      },
      {
        name: t('dashboard.usersNumber'),
        type: 'line',
        areaStyle: {
          color: '#1890ff',
          opacity: 0.3,
        },
        emphasis: {
          focus: 'series',
        },
        data: [90, 122, 90, 140, 123, 280, 200],
      },
    ],
  };

  const [echartsRef] = useEcharts(option);

  return (
    <div className="h-550px w-full border border-gray-200 rounded-10px">
      <div ref={echartsRef} className="w-full h-full"></div>
    </div>
  );
}

export default Line;
