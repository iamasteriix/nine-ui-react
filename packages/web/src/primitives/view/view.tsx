import { resolveA11y, } from '@/utils';
import { resolveSx, useMediaQuery } from '@lucidjs/core';
import type { ViewProps, } from './view.types';
import { resolveViewClasses } from './view.utils';


export const View = ({
  sx, a11y, style, children, testID, ref,
  variant = { name: 'flat', },
}: ViewProps) => {
  const { breakpoint, } = useMediaQuery();

  const className = resolveViewClasses(variant);    // build class name from variant features
  const sxStyles = resolveSx(sx, breakpoint);       // resolve sx into inline styles
  const styleObj = Object.assign(sxStyles, style);  // merge style properties
  const accessibility = resolveA11y(a11y);          // resolve accessibility props

  return (
    <div
      className={ className }
      style={ styleObj }
      data-component='view'
      data-testid={ testID }
      data-variant={ variant.name }
      ref={ ref }
      { ...accessibility }
    >
      { children }
    </div>
  );
}
