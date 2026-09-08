import { resolveA11y, } from "@/utils";
import { resolveSx, useMediaQuery } from "@lucidjs/core";
import type { IconProps, IconVariant } from "./icon.types";


const sizeMap: Record<NonNullable<IconVariant['size']>, string> = {
  xsm: 'var(--typography-textXs)',
  sm: 'var(--typography-textSm)',
  md: 'var(--typography-textLg)',
  lg: 'var(--typography-textXl)',
};


export const Icon = ({
  variant = {
    name: 'monochrome',
    size: 'md',
    solid: false,
  },
  a11y = {
    role: 'presentation',
    hidden: true,
  },
  as: IconComponent,
  sx,
  style,
  testID,
}: IconProps) => {
  const { breakpoint, } = useMediaQuery();
  
  const fontSize = sizeMap[variant.size || 'md'];
  const fill = variant.name === 'duotone' ? ['var(--colors-primary)', 'var(--colors-accent)'] : 'var(--colors-primary)';
  
  const sxStyles = resolveSx(sx, breakpoint);       // resolve sx into inline styles
  const styleObj = Object.assign(sxStyles, style);  // merge style properties
  const accessibility = resolveA11y(a11y);          // resolve accessibility props

  return (
    <span
      style={ styleObj }
      data-component='icon'
      data-testid={ testID }
      data-variant={ variant.name }
      { ...accessibility }
    >
      <IconComponent
        viewBox='0 0 24 24'
        size={ fontSize }
        fill={ fill }
        variant={ variant.name }
        solid={ variant.solid }
      />
    </span>
  );
}
