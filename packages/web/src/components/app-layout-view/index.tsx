import { ThemeProvider } from '@/theme';
import { resolveA11y } from '@/utils';
import { resolveSx, useMediaQuery } from '@lucidjs/core';
import '@lucidjs/web/assets/styles/fonts.css';
import type { AppLayoutViewProps } from './types';
import { resolveVariantClasses } from './utils';


export const AppLayoutView = ({
  themes,
  persister,
  sx,
  a11y,
  style,
  children,
  testID,
}: AppLayoutViewProps) => {
  const { breakpoint, } = useMediaQuery();

  const className = resolveVariantClasses();        // build class name from variant features
  const sxStyles = resolveSx(sx, breakpoint);       // resolve sx into inline styles
  const styleObj = Object.assign(sxStyles, style);  // merge style properties
  const accessibility = resolveA11y(a11y);          // resolve accessibility props

  return (
    <div
      className={ className }
      style={ styleObj }
      data-component='app-layout-view'
      data-testid={ testID }
      { ...accessibility }
    >
      <ThemeProvider
        themes={ themes }
        persister={ persister }
      >
        { children }
      </ThemeProvider>
    </div>
  );
}
