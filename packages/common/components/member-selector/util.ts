import createAxios from '../../utils/axios';
import { TreeData, Key } from './type';

export const axios = createAxios({
  baseURL: `${window.EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/runtime/v1`,
});

type DeptsResponse = {
  id: number;
  name: string;
  children?: DeptsResponse;
}[];

export async function fetchDepts(projectId: number | string): Promise<TreeData> {
  const { data } = await axios.get<{ data: DeptsResponse }>(`/dept/list/all/${projectId}`);

  function formatTreeData(data?: DeptsResponse): TreeData {
    if (!data) return [];

    const treeData: TreeData = [];

    data.forEach((item) => {
      treeData.push({
        key: item.id,
        title: item.name,
        children: formatTreeData(item.children),
      });
    });

    return treeData;
  }

  return formatTreeData(data);
}

export function treeDataMap(data: TreeData, map: { [key: string]: TreeData[number] }) {
  data.forEach((node) => {
    map[node.key] = node;

    if (node.children && node.children.length) {
      treeDataMap(node.children, map);
    }
  });

  return map;
}

export function excludeTreeChildren(tree: TreeData, checkeds: Key[]): Key[] {
  let value: Key[] = [];
  let keyMap = checkeds.reduce((curr, next) => {
    curr = {
      ...curr,
      [next]: true,
    };

    return curr;
  }, {} as { [key: string]: true });

  tree.forEach(function loop(node) {
    if (keyMap[node.key]) {
      value.push(node.key);
    } else {
      if (node.children) {
        node.children.some(loop);
      }
    }
  });

  return value;
}

export function filterTreeData(tree: TreeData, keyword: string): Key[] {
  let tmps: Key[] = [];

  function loop(data: TreeData, keys: Key[]): Key[] {
    data.forEach((item) => {
      tmps.push(item.key);

      if (item.children && item.children.length > 0) {
        loop(item.children, keys);
      } else if (item.title.indexOf(keyword) > -1) {
        keys.push(...tmps);
      }

      tmps = tmps.slice(0, -1);
    });

    return keys;
  }

  return loop(tree, []);
}

console.log(
  filterTreeData(
    [
      {
        title: '父节点',
        key: '1',
        children: [
          {
            title: '子节点-11-1',
            key: '1-1',
            children: [],
          },
          {
            title: '子节点-11-2',
            key: '1-2',
            children: [
              {
                title: '子节点-11-1-1',
                key: '1-2-1',
              },
            ],
          },
        ],
      },
      {
        title: '父节点2',
        key: '2',
        children: [
          {
            title: '子节点-22-1',
            key: '2-1',
            children: [],
          },
          {
            title: '子节点-22-2',
            key: '2-2',
            children: [],
          },
        ],
      },
    ],
    '11',
  ),
);
