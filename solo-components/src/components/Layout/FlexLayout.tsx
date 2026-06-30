import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { CSSProperties } from 'react';
import { cssProp, dontForwardProps } from '../../_internal/utils';
import { Spacer, type SpacerProps } from './Spacer';

// region Component

export type FlexLayoutProps = SpacerProps & {
  horizontal?: boolean;
  vertical?: boolean;
  gap?: CSSProperties['gap'] | number;
  display?: CSSProperties['display'];
  flexWrap?: CSSProperties['flexWrap'];
  justifyContent?: CSSProperties['justifyContent'];
  alignItems?: CSSProperties['alignItems'];
  alignContent?: CSSProperties['alignContent'];
  flexDirection?: CSSProperties['flexDirection'];
  overflow?: CSSProperties['overflow'];
  column?: boolean;
  row?: boolean;
  nowrap?: boolean;
  expandChildren?: boolean;
};

/**
 * Quick horizontal, vertical, or centered (horizontal & vertical) flex layout.
 * A numeric `gap` is treated as a 0.25em scale step (e.g. `gap={3}` → `0.75em`).
 */
export const FlexLayout = styled(
  Spacer,
  dontForwardProps(
    'horizontal',
    'vertical',
    'gap',
    'display',
    'flexWrap',
    'justifyContent',
    'alignItems',
    'alignContent',
    'flexDirection',
    'overflow',
    'column',
    'row',
    'nowrap',
    'expandChildren'
  )
)<FlexLayoutProps>(({
  horizontal,
  vertical,
  gap,
  display,
  flexWrap,
  nowrap,
  justifyContent,
  alignItems,
  alignContent,
  flexDirection,
  column,
  row,
  maxWidth,
  minWidth,
  maxHeight,
  expandChildren,
  overflow
}) => {
  if (typeof gap === 'number') gap = gap * 0.25 + 'em';
  return css`
    display: flex;
    ${cssProp('justify-content', justifyContent ? justifyContent : horizontal ? 'center' : undefined)}
    ${cssProp('align-items', alignItems ? alignItems : vertical ? 'center' : undefined)}
    ${cssProp('align-content', alignContent ? alignContent : vertical ? 'center' : undefined)}
    ${cssProp('flex-direction', flexDirection ? flexDirection : column ? 'column' : row ? 'row' : undefined)}
    ${cssProp('gap', gap)}
    ${cssProp('display', display)}
    ${cssProp('flex-wrap', flexWrap ? flexWrap : nowrap ? 'nowrap' : 'wrap')}
    ${cssProp('overflow', overflow)}
    max-width: ${maxWidth ?? '100%'};
    ${minWidth
      ? css`
          min-width: ${minWidth};
        `
      : ''}
    max-height: ${maxHeight ?? '100%'};
    ${expandChildren &&
    css`
      > * {
        flex-grow: 1;
        width: auto;
      }
    `}
  `;
});

/** Adds a `flex-grow: 1` filler into a flex layout. */
export const FlexLayoutSpacer = styled.div<{ flexBasis?: CSSProperties['flexBasis'] }>(
  ({ flexBasis }) => css`
    flex-grow: 1;
    ${cssProp('flex-basis', flexBasis)}
  `
);
