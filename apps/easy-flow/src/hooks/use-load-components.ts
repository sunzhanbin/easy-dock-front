import React, { useState, useEffect, useMemo } from 'react';
import { AllComponentType } from '@type';
import componentSchema from '@/config/components';

const categoryList: { key: string; value: string }[] = [
  { key: '基础控件', value: 'basic-components' },
  { key: '布局控件', value: 'senior-components' },
  { key: '业务控件', value: 'business-components' },
];
type ComponentCommonProps = {
  readOnly: boolean;
};

type Component = React.FC<ComponentCommonProps> | React.ComponentClass<ComponentCommonProps>;
type ComponentMaps = { [key in AllComponentType['type']]?: Component };

export default function useLoadComponents(componentType: AllComponentType['type']): Component | undefined;
export default function useLoadComponents(componentTypes: AllComponentType['type'][]): ComponentMaps | undefined;
export default function useLoadComponents(
  componentTypes: AllComponentType['type'] | AllComponentType['type'][],
): Component | ComponentMaps | undefined {
  const [componentMaps, setComponentMaps] = useState<ComponentMaps>();
  const typesJson = useMemo(() => {
    let allTypes: AllComponentType['type'][] = [];

    if (Array.isArray(componentTypes)) {
      allTypes = componentTypes;
    } else {
      allTypes = [componentTypes];
    }

    return JSON.stringify(allTypes);
  }, [componentTypes]);

  useEffect(() => {
    const compMaps: ComponentMaps = {};
    let types: AllComponentType['type'][] = JSON.parse(typesJson);

    const compPromises = types.map(
      (type) =>
        new Promise((resolve, reject) => {
          if (!type) {
            // reject(new Error('无效的控件类型'));
            return;
          }
          const categoryName = componentSchema[type].baseInfo.category;
          const categoryPath = categoryList.find((v) => v.key === categoryName)?.value;
          import(`../components/basic-shop/${categoryPath}/${type}/index`).then((comp) => {
            if (comp && comp.default) {
              compMaps[type] = comp.default;
            } else {
              compMaps[type] = comp;
            }

            resolve(comp);
          });
        }),
    );
    Promise.all(compPromises).then(() => {
      setComponentMaps(compMaps);
    });
  }, [typesJson]);

  if (Array.isArray(componentTypes)) {
    return componentMaps;
  } else {
    return componentMaps ? componentMaps[componentTypes] : undefined;
  }
}
