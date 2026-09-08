import type { LayoutProps, } from '@/types';
import type { SxElevation, SxShadow } from '@lucidjs/core';


export type FlatVariant = {
  name: 'flat';
  fill?: 'base' | 'surface' | 'subtle' | 'raised' | 'overlay' | 'floating';
  elevation?: SxElevation;
  shadow?: SxShadow;
  focus?: 'accent' | 'info' | 'success' | 'warning' | 'error';
};

export type GlassVariant = {
  name: 'glass',
  tone?: 'neutral' | 'accent';
  intensity?: 'faint' | 'subtle' | 'base' | 'strong';
  elevation?: SxElevation;
  blur?: 'sm' | 'md' | 'lg';
};

export type ViewVariant = FlatVariant | GlassVariant;

export type ViewProps = LayoutProps & {
  variant?: ViewVariant;
};

