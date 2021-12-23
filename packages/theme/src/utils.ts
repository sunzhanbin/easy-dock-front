/* eslint-disable import/prefer-default-export, prefer-destructuring */
import { TinyColor } from '@ctrl/tinycolor';
import { generate } from '@ant-design/colors';
import cssVars from "css-vars-ponyfill";

export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

function spinalToCamel (name: string, suffix: string) {
  return name.replace(`--${suffix}-`, '').split('-').map((item: string, index: number) => {
    if(index == 0) return item;
    const firstLetter = item.charAt(0);
    return item.replace(firstLetter, firstLetter.toUpperCase());
  }).join('');
};

export function registerTheme(theme: {[key: string]: string}) {
  const antSet: {[key:string]: string} = {};
  const customSet: {[key: string]: string} = {};
  for(let [key, value] of Object.entries(theme)) {
    if(key.startsWith('--ant-')) {
      antSet[key] = value
    } else if (key === 'theme') {
      if(value === 'normal') {
        document.documentElement.removeAttribute('theme');
      } else {
        document.documentElement.setAttribute('theme', value);
      }
    } else {
      customSet[key] = value;
    };
  }
  if(Object.keys(antSet)?.length) {
    registerAntTheme(antSet);
  }
  if(Object.keys(customSet)?.length) {
    registerCustomTheme(customSet);
  }
}

export function registerCustomTheme(theme: {[key: string]: string}) {
  cssVars({
    variables: theme
  })
}

export function registerAntTheme(theme: {[key: string]: string}, globalPrefixCls = 'ant') {
  theme = Object.fromEntries(Object.entries(theme).map(([key, value]) => [spinalToCamel(key, 'ant'), value]));

  const variables: Record<string, string> = {};

  const formatColor = (
    color: TinyColor,
    updater?: (cloneColor: TinyColor) => TinyColor | undefined,
  ) => {
    let clone = color.clone();
    clone = updater?.(clone) || clone;
    return clone.toRgbString();
  };

  const fillColor = (colorVal: string, type: string) => {
    const baseColor = new TinyColor(colorVal);
    const colorPalettes = generate(baseColor.toRgbString());

    variables[`${type}-color`] = formatColor(baseColor);
    variables[`${type}-color-disabled`] = colorPalettes[1];
    variables[`${type}-color-hover`] = colorPalettes[4];
    variables[`${type}-color-active`] = colorPalettes[7];
    variables[`${type}-color-outline`] = baseColor.clone().setAlpha(0.2).toRgbString();
    variables[`${type}-color-deprecated-bg`] = colorPalettes[1];
    variables[`${type}-color-deprecated-border`] = colorPalettes[3];
  };

  // ================ Primary Color ================
  if (theme.primaryColor) {
    fillColor(theme.primaryColor, 'primary');

    const primaryColor = new TinyColor(theme.primaryColor);
    const primaryColors = generate(primaryColor.toRgbString());

    // Legacy - We should use semantic naming standard
    primaryColors.forEach((color, index) => {
      variables[`primary-${index + 1}`] = color;
    });
    // Deprecated
    variables['primary-color-deprecated-l-35'] = formatColor(primaryColor, c => c.lighten(35));
    variables['primary-color-deprecated-l-20'] = formatColor(primaryColor, c => c.lighten(20));
    variables['primary-color-deprecated-t-20'] = formatColor(primaryColor, c => c.tint(20));
    variables['primary-color-deprecated-t-50'] = formatColor(primaryColor, c => c.tint(50));
    variables['primary-color-deprecated-f-12'] = formatColor(primaryColor, c =>
      c.setAlpha(c.getAlpha() * 0.12),
    );

    const primaryActiveColor = new TinyColor(primaryColors[0]);
    variables['primary-color-active-deprecated-f-30'] = formatColor(primaryActiveColor, c =>
      c.setAlpha(c.getAlpha() * 0.3),
    );
    variables['primary-color-active-deprecated-d-02'] = formatColor(primaryActiveColor, c =>
      c.darken(2),
    );
  }

  // ================ Success Color ================
  if (theme.successColor) {
    fillColor(theme.successColor, 'success');
  }

  // ================ Warning Color ================
  if (theme.warningColor) {
    fillColor(theme.warningColor, 'warning');
  }

  // ================= Error Color =================
  if (theme.errorColor) {
    fillColor(theme.errorColor, 'error');
  }

  // ================= Info Color ==================
  if (theme.infoColor) {
    fillColor(theme.infoColor, 'info');
  }

  const cssVariables = Object.fromEntries(Object.entries(variables).map(([key, value]) => [`--${globalPrefixCls}-${key}`, value]));

  cssVars({
    variables: cssVariables
  })
}