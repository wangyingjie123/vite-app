/**
 * 添加 Cookie
 * @param {[string]} key       [Cookie 的名称]
 * @param {[string]} value      [Cookie 的值]
 * @param {[number]} days [Cookie 的过期时间]
 */
//后三个参数为可选项
export function setCookie(key: string, value: string, day: number, path?: string, domin?: string) {
  //1.处理保存的路径
  //找到html文件前的 / 索引
  const index = window.location.pathname.lastIndexOf('/');
  const currentIndex = window.location.pathname.slice(0, index);
  path = path || currentIndex;
  //2.处理默认保存的domin(域名)
  domin = domin || document.domain;

  //3.处理输入的时间
  if (!day) {
    document.cookie = key + '=' + value + ';path=' + path + ';domin=' + domin;
  } else {
    const date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = key + '=' + value + ';expires=' + date.toUTCString() + ';path=' + path + ';domin=' + domin;
  }
}
export function getCookie(key: string) {
  //以分号分割cookie并返回一个数组
  const res = document.cookie.split(';');
  for (let i = 0; i < res.length; i++) {
    const temp = res[i].split('=');
    if (temp[0].trim() === key) {
      return temp[1];
    }
  }
}

//对于cookie来说，如果expires即cookie过期时间为过去的值，那么浏览器会自动清除cookie
export function delCookie(key: string) {
  setCookie(key, getCookie(key) || '', -999);
}
