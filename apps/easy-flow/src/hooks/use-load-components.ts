import React, { useState, useEffect, useMemo } from 'react';
import { AllComponentType } from '@type';

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
        new Promise((resolve) => {
          import(`../components/basic-shop/basic-components/${type}/index`).then((comp) => {
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
