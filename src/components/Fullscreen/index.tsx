import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useFullscreen } from '@/hooks/useFullscreen';

/**
 * @description: 全屏组件
 */
function Fullscreen() {
  const { t } = useTranslation();
  const [isFullscreen, toggleFullscreen, setFullscreen] = useFullscreen();

  useEffect(() => {
    const fullscreenEventListener = () => {
      if (document.fullscreenElement) {
        setFullscreen(true);
      } else {
        setFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', fullscreenEventListener);
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenEventListener);
    };
  }, []);
  return (
    <Tooltip title={isFullscreen ? t('public.exitFullscreen') : t('public.fullScreen')}>
      <div className="flex items-center justify-center text-lg cursor-pointer" onClick={toggleFullscreen}>
        {isFullscreen && <Icon icon="gridicons-fullscreen-exit" />}
        {!isFullscreen && <Icon icon="gridicons-fullscreen" />}
      </div>
    </Tooltip>
  );
}

export default Fullscreen;
