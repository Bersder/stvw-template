export function setCookie(key: string, value: string, expDays = 0, domain = ''): void {
  let expires = '';
  if (expDays) {
    const date = new Date();
    date.setTime(date.getTime() + expDays * 86400000);
    expires = `expires=${date.toUTCString()};`;
  }
  domain = domain ? `domain=${domain};` : '';
  document.cookie = `${key}=${escape(value)};${domain}${expires}path=/`;
}

export function getCookie(key: string): string {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(key + '=');
    if (start !== -1) {
      start = start + key.length + 1;
      let end = document.cookie.indexOf(';', start);
      if (end === -1) {
        end = document.cookie.length;
        return unescape(document.cookie.substring(start, end));
      }
      else
        return unescape(document.cookie.substring(start, end));
    }
  }
  return '';
}