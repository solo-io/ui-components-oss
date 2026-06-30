import styled from '@emotion/styled';
import type { CSSProperties } from 'react';
import { cssProp, dontForwardProps } from '../../_internal/utils';
import { Spacer, type SpacerProps } from '../Layout/Spacer';

// region Helpers

const truncated = `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// region Component

/**
 * Typography primitive built on `Spacer` (so margin/padding/sizing props work
 * too). Defaults to the theme's `--color-text-primary`, so text color follows
 * the active light/dark mode unless `color` is set explicitly.
 */
export type TextProps = SpacerProps & {
  size?: CSSProperties['fontSize'];
  weight?: CSSProperties['fontWeight'];
  lineHeight?: CSSProperties['lineHeight'];
  color?: CSSProperties['color'];
  textAlign?: CSSProperties['textAlign'];
  whiteSpace?: CSSProperties['whiteSpace'];
  truncate?: boolean;
  wordBreak?: CSSProperties['wordBreak'];
  textTransform?: CSSProperties['textTransform'];
  fontStyle?: CSSProperties['fontStyle'];
  inline?: boolean;
};

export const Text = styled(
  Spacer,
  dontForwardProps(
    'size',
    'weight',
    'lineHeight',
    'color',
    'textAlign',
    'whiteSpace',
    'truncate',
    'wordBreak',
    'textTransform',
    'fontStyle',
    'inline'
  )
)<TextProps>(
  ({ size, weight, lineHeight, color, textAlign, whiteSpace, truncate, wordBreak, textTransform, fontStyle, inline, display }) => `
    font-family: var(--solo-font-family, inherit);
    color: ${color ?? 'var(--color-text-primary, #fafafa)'};
    ${cssProp('font-size', size)}
    ${cssProp('font-weight', weight)}
    ${cssProp('line-height', lineHeight)}
    ${cssProp('text-align', textAlign)}
    ${cssProp('white-space', whiteSpace)}
    ${cssProp('word-break', wordBreak)}
    ${cssProp('text-transform', textTransform)}
    ${cssProp('font-style', fontStyle)}
    ${cssProp('display', display ?? (inline ? 'inline' : 'block'))}
    ${truncate ? truncated : ''}
  `
);
