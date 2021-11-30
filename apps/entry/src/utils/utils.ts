export const findItem = (id: string, menu: any[]) => {
  let result;
  let hasFind: boolean;
  menu.forEach((item) => {
    const recurse = (id: string, item: { [key: string]: any }) => {
      if (hasFind) return;
      if (item.id === id) {
        result = item;
        hasFind = true;
      }
      item.children &&
        item.children.forEach((child: { [key: string]: any }) =>
          recurse(id, child)
        );
    };

    recurse(id, item);
  });
  return result;
};
