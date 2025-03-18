import type { TreeSelectProps } from 'antd';
import { TreeSelect } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Loading from './components/Loading';
import type { ApiTreeSelectProps } from './types';

import { MAX_TAG_COUNT } from './index';

/**
 * @description: 根据API获取数据下拉树形组件
 */
function ApiTreeSelect(props: ApiTreeSelectProps) {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState<TreeSelectProps['treeData']>([]);

  // 清除自定义属性
  const params: Partial<ApiTreeSelectProps> = { ...props };
  delete params.api;
  delete params.params;
  delete params.apiResultKey;

  /** 获取接口数据 */
  const getApiData = useCallback(async () => {
    if (!props.api) return;
    try {
      const { api, params, apiResultKey } = props;

      setLoading(true);
      if (api) {
        const apiFun = Array.isArray(params) ? api(...params) : api(params);
        const { code, data } = await apiFun;
        if (Number(code) !== 200) return;
        const result = apiResultKey ? (data as { [apiResultKey: string]: unknown })?.[apiResultKey] : data;
        setOptions(result as TreeSelectProps['treeData']);
      }
    } finally {
      setLoading(false);
    }
  }, [props]);

  useEffect(() => {
    // 当有值且列表为空时，自动获取接口
    if (props.value && options?.length === 0) {
      getApiData();
    }
  }, [props.value]);

  /**
   * 展开下拉回调
   * @param open - 是否展开
   */
  const onDropdownVisibleChange = (open: boolean) => {
    if (open) getApiData();

    props.onDropdownVisibleChange?.(open);
  };

  return (
    <TreeSelect
      allowClear
      showSearch
      maxTagCount={MAX_TAG_COUNT}
      treeNodeFilterProp={params?.fieldNames?.label || 'label'}
      placeholder={t('public.inputPleaseSelect')}
      {...params}
      loading={isLoading}
      treeData={options}
      notFoundContent={isLoading && <Loading />}
      onDropdownVisibleChange={onDropdownVisibleChange}
    />
  );
}

export default ApiTreeSelect;
