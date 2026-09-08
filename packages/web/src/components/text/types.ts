import type { ElementBaseProps, } from '@/types';
import type { SxColor, SxTypeface } from '@lucidjs/core';
import type { ReactElement, Ref } from 'react';


type TextRole = 
  | 'hero-lg' | 'hero'
  | 'section-xl' | 'section-lg' | 'section'
  | 'title-lg' | 'title'
  | 'heading-lg' | 'heading' | 'heading-sm'
  | 'body' | 'body-strong'
  | 'caption' | 'caption-strong'
  | 'mouseprint'
  | 'micro';

/**
 * Restrict children to regular strings and numbers with safe support for conditional
 * rendering, arrays, and nested `<Text>` components
 */
type TextChild = string | number | boolean | null | undefined | ReactElement<TextProps>;

export type TextVariant = {
  name: TextRole;
  typeface?: SxTypeface;
  color?: SxColor;
};

export type TextProps = Omit<ElementBaseProps, 'children'> & {
  variant?: TextVariant;
  lines?: number;
  children?: TextChild | TextChild[];
  ref?: Ref<HTMLParagraphElement>;
};
