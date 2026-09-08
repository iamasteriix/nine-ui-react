import type { LayoutProps } from '@/types';
import type { SxElevation, } from '@lucidjs/core';


type ViewVariant = {
  fill?: 'base' | 'surface' | 'subtle' | 'raised' | 'overlay' | 'floating';
  elevation?: SxElevation;
  outline?: 'accent' | 'info' | 'success' | 'warning' | 'error';
  shadow?: 'auto' | 'none';
};

type GlassViewVariant = {
  tone?: 'base' | 'accent';
  elevation?: SxElevation;
  alpha?: 'low' | 'medium' | 'high';
  blur?: 'sm' | 'md' | 'lg';
};

export type ViewProps = LayoutProps & {
  variant?: ViewVariant;
};

export type GlassViewProps = LayoutProps & {
  variant?: GlassViewVariant;
};
