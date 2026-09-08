import { resolveSizeToPx } from "@/utils";
import type { ResponsiveProp, SxGap, SxSpace } from "@lucidjs/core";
import { resolveBreakpoint, useMediaQuery } from "@lucidjs/core";
import { useLayoutEffect, useRef, useState } from "react";
import type { ResponsiveColType, ResponsiveHookOptions } from "./grid.types";


/**
 * Uses current viewport breakpoint to determine column number, gap sizes, and
 * how to arrange child elements
 */
export const useResponsiveGrid = (
  columns:    ResponsiveProp<number | ResponsiveColType>,
  columnGap:  ResponsiveProp<SxGap | SxSpace>           | undefined,
  rowGap:     ResponsiveProp<SxGap | SxSpace>           | undefined,
): ResponsiveHookOptions => {
  const ref = useRef<HTMLDivElement>(null);
  const { breakpoint, } = useMediaQuery();
  const [containerWidth, setContainerWidth] = useState(0);

  // resolve viewport breakpoints for columns and gaps
  const resolvedColumns = resolveBreakpoint(columns, breakpoint) ?? 1;
  const gapX = resolveBreakpoint(columnGap, breakpoint) ?? '0px';
  const gapY = resolveBreakpoint(rowGap, breakpoint) ?? '0px';

  // normalize gap values
  const gapXParsed = resolveSizeToPx(gapX);
  const gapYParsed = resolveSizeToPx(gapY);

  // observe container size when using auto-fit dynamic columns
  useLayoutEffect(() => {
    if (typeof resolvedColumns === 'number' || !ref.current) return;
    const element = ref.current;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    }
  }, [resolvedColumns]);

  // return simple fixed column count
  if (typeof resolvedColumns === 'number') {
    return {
      colNum: Math.max(1, resolvedColumns),
      gapX: gapXParsed,
      gapY: gapYParsed,
      repeat: 'fill',
      ref,
    };
  }

  // calculate dynamic container width
  const {
    minWidth,
    maxNum = Infinity,
    repeat = 'fill',
  } = resolvedColumns;
  const cell = (containerWidth +gapXParsed) /(minWidth +gapXParsed);
  const fit = Math.max(1, Math.floor(cell));

  return {
    colNum: Math.min(fit, maxNum),
    gapX: gapXParsed,
    gapY: gapYParsed,
    repeat,
    ref,
  };
}
