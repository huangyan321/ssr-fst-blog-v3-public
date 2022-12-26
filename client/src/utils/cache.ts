export function setCache(
  key: string,
  value: any,
  isSession: boolean = false
): boolean {
  try {
    const parseValue = JSON.stringify(value);
    if (isSession) {
      window.sessionStorage.setItem(key, parseValue);
    } else {
      window.localStorage.setItem(key, parseValue);
    }
    return true;
  } catch (err) {
    return false;
  }
}
export function getCache(key: string, isSession: boolean = false): any {
  try {
    let value = null;
    if (isSession) {
      value = window.sessionStorage.getItem(key);
    } else {
      value = window.localStorage.getItem(key);
    }
    if (value) {
      const parseValue = JSON.parse(value);
      return parseValue;
    }
  } catch (err) {
    return null;
  }
}
export function deleteCache(key: string, isSession: boolean = false): boolean {
  try {
    if (isSession) {
      window.sessionStorage.removeItem(key);
    } else {
      window.localStorage.removeItem(key);
    }
    return true;
  } catch (err) {
    return false;
  }
}
