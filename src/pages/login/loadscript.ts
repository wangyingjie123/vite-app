export function loadScript(src: string, id: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // 如果已加载相同 ID 的 script，直接返回
    if (id && document.getElementById(id)) {
      resolve(id);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (id) script.id = id;

    script.onload = () => resolve(id);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.body.appendChild(script);
  });
}
export function removeScriptById(id: string) {
  const script = document.getElementById(id);
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}
