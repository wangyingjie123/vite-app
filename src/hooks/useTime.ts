import dayjs from 'dayjs';
import { useEffect, useState, useRef } from 'react';

/**
 * @description 获取本地时间
 */
export const useTimes = () => {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [time, setTime] = useState(dayjs().format('YYYY年MM月DD日 HH:mm:ss'));
  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(dayjs().format('YYYY年MM月DD日 HH:mm:ss'));
    }, 1000);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [time]);

  return {
    time,
  };
};
