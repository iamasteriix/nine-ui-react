import type { SxProps } from '@lucidjs/core';
import type { CSSProperties, ReactElement, Ref, } from 'react';
import type { A11yProps } from './accessibility';


type ElementChildren = ReactElement | ElementChildren[];  // self-referential

export type ElementBaseProps = {
  sx?: SxProps;
  a11y?: A11yProps;
  style?: CSSProperties;
  children?: ElementChildren;
  testID?: string;
};

export type LayoutProps = ElementBaseProps & {
  ref?: Ref<HTMLDivElement>;
};
