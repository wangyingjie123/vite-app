import * as echarts from 'echarts';
import { useCallback, useEffect, useRef } from 'react';
/**
 * 使用Echarts
 * @param options -  绘制echarts的参数
 * @param data -  数据
 */
export const useEcharts = (options: echarts.EChartsCoreOption, data?: unknown) => {
  const echartsRef = useRef<echarts.EChartsType | null>(null);
  const htmlDivRef = useRef<HTMLDivElement>(null);

  let isInit = false;
  /** 销毁echarts */
  const dispose = () => {
    if (htmlDivRef.current) {
      echartsRef.current?.dispose();
      echartsRef.current = null;
    }
  };

  /** 初始化 */
  const init = useCallback(() => {
    if (options) {
      // 摧毁echarts后在初始化
      dispose();

      // 初始化chart
      if (htmlDivRef.current) {
        echartsRef.current = echarts.init(htmlDivRef.current);
        echartsRef.current.setOption(options);
      }
    }
  }, [options]);

  /** 监听窗口大小变化，自适应图表 */
  const resizeHandler = () => {
    setTimeout(() => {
      echartsRef.current?.resize();
    }, 500);
  };

  useEffect(() => {
    if (!htmlDivRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (htmlDivRef.current!.clientWidth <= 0) {
        return;
      }
      if (isInit === false) {
        init();
        isInit = true;
      }
      resizeHandler();
      // resizeObserver.disconnect(); // 监听到合适的尺寸后就停止监听
    });

    resizeObserver.observe(htmlDivRef.current); // 监听 div 尺寸变化

    return () => {
      resizeObserver.disconnect();
      dispose(); // 清理 ECharts
    };
  }, [htmlDivRef.current]);

  useEffect(() => {
    if (data) {
      echartsRef?.current?.setOption(options);
    }
  }, [data]);

  return [htmlDivRef] as const;
};
