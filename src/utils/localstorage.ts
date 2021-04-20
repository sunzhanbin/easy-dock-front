export const localStorage = (key: string, value?: string) => {
  if (value === undefined) {
    return window.localStorage.getItem(key);
  } else {
    window.localStorage.setItem(key, value);

    return value;
  }
};
