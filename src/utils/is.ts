/**
 * 是否是方法
 * @param val - 参数
 */
export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}

/**
 * 是否是数字
 * @param obj - 值
 */
export function isNumber(obj: unknown): boolean {
  return typeof obj === 'number' && isFinite(obj);
}

/**
 * 是否是URL
 * @param path - 路径
 */
export function isUrl(path: string): boolean {
  const reg =
    /^(https?:\/\/)?([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)?@)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|localhost|(\d{1,3}\.){3}\d{1,3})(:\d{2,5})?(\/[^\s]*)?$/;
  return reg.test(path);
}

/**
 * 是否是NULL
 * @param value - 值
 */
export function isNull(value: unknown): boolean {
  return value === null;
}
