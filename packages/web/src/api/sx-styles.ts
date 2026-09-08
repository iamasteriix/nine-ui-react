import type { VariantRegistry, } from '@/types';
import type { SxProps, ThemeTokensType } from '@lucidjs/core';
import { tokens } from '@lucidjs/core';


/**
 * Merges a partial theme override with the default tokens
 * Only one level of nesting — we merge per category, not recursively.
 */
const mergeTheme = (
  base: ThemeTokensType,
  override?: ThemeTokensType
): ThemeTokensType => {
  if (!override) return tokens;
  return {
    colors:     { ...base.colors,     ...override.colors, },
    typography: { ...base.typography, ...override.typography, },
    spacing:    { ...base.spacing,    ...override.spacing, },
    shape:      { ...base.shape,      ...override.shape, },
    elevation:  { ...base.elevation,  ...override.elevation, },
    optical:    { ...base.optical,    ...override.optical, },
    motion:     { ...base.motion,     ...override.motion, },
  }
}


export const SxStyles = {
  create: <T extends Record<string, SxProps>> (styles: T): T => styles,


  /**
   * Uses a mapped type indexed over optional `keyof VariantRegistry` to isolate
   * component types and narrows down the mapped type by stripping features with
   * `undefined` values using `NonNullable`. Making the keys optional allows defining
   * variants for a single component.
   */
  variants: <
    T extends { [K in keyof VariantRegistry]?: Record<string, NonNullable<VariantRegistry[K]>> }
  > (recipe: T): T => recipe,


  /**
   * Takes a `base` theme object and an optional list of named theme variations that
   * merge an override from the list with `base` using its `name` to produce the whole
   * named set at once.
   * 
   * `N` is constrained to an array of objects that implement `ThemeTokensType` and an
   * additional `name` property to help identify the theme variations.
   */
  themes: <N extends readonly (ThemeTokensType & { name: string })[]> (
    base: ThemeTokensType = tokens,
    list: N = [] as unknown as N,
  ) => {{
    const named = Object.fromEntries(
      list.map(({ name, ...partial }) => {
        return [name, mergeTheme(base, partial)]
      })
    ) as { [K in N[number]['name']]: ThemeTokensType };
    return Object.assign(base, named);
  }},
};
