import type { ServerResult } from '@south/request';
import type { SelectProps, TreeSelectProps } from 'antd';

export type ApiFn = (params?: object | unknown[]) => Promise<ServerResult<unknown>>;

// api参数
interface ApiParam {
  api?: ApiFn;
  params?: object | unknown[];
  apiResultKey?: string;
}

// ApiSelect
export type ApiSelectProps = ApiParam & SelectProps;

// ApiTreeSelect
export type ApiTreeSelectProps = ApiParam & TreeSelectProps;
