export const localStorage = {
  get(key: string) {
    return window.localStorage.getItem(key);
  },
  set(key: string, value: string) {
    window.localStorage.setItem(key, value);

    return value;
  },
  clear(key: string) {
    window.localStorage.removeItem(key);
  },
};
